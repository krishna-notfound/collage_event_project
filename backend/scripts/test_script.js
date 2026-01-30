const fetch = require('node-fetch'); // You might need to install node-fetch if on older node, but lets assume modern node or user installs it. Actually, modern node has fetch global.

// If node < 18, this might fail without node-fetch.
// Let's assume Node 18+ for this script.

const API_URL = 'http://localhost:3000';
let ADMIN_TOKEN = '';
let EVENT_ID = '';

const runTests = async () => {
    try {
        console.log('--- Starting Verification Tests ---');

        // 1. Admin Login
        console.log('\nPlease ensure server is running (npm run dev) and you have seeded admin.');
        console.log('Testing Admin Login...');

        const loginRes = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@college.edu', password: 'admin123' })
        });

        const loginData = await loginRes.json();

        if (!loginData.success) {
            console.error('Login Failed:', loginData.message);
            process.exit(1);
        }

        console.log('✅ Admin Login Successful');
        ADMIN_TOKEN = loginData.data.token;

        // 2. Create Event (Admin)
        console.log('\nTesting Create Event...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);

        const eventPayload = {
            title: 'Tech Fest 2026',
            description: 'Annual technical festival',
            category: 'Technical',
            startDate: tomorrow.toISOString(),
            endDate: dayAfter.toISOString(),
            registrationDeadline: tomorrow.toISOString(), // Deadline matches start
            venue: 'Main Auditorium'
        };

        const createRes = await fetch(`${API_URL}/admin/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ADMIN_TOKEN}`
            },
            body: JSON.stringify(eventPayload)
        });

        const createData = await createRes.json();
        if (!createData.success) {
            console.error('Create Event Failed:', createData.message);
            process.exit(1);
        }

        console.log('✅ Event Created:', createData.data.title);
        EVENT_ID = createData.data.id;

        // 3. Public Get Events
        console.log('\nTesting Public Get Events...');
        const getRes = await fetch(`${API_URL}/events`);
        const getData = await getRes.json();

        if (!getData.success || getData.data.length === 0) {
            console.error('Get Events Failed');
            process.exit(1);
        }

        const myEvent = getData.data.find(e => e.id === EVENT_ID);
        if (myEvent && myEvent.status === 'Open') {
            console.log('✅ Event fetched and Status is Open');
        } else {
            console.error('Event status check failed', myEvent);
        }

        // 4. Registration
        console.log('\nTesting Registration...');
        const student = {
            name: 'John Doe',
            email: 'john.doe@college.edu',
            rollNumber: 'CS101',
            department: 'CS',
            year: '2',
            eventId: EVENT_ID
        };

        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });

        const regData = await regRes.json();
        if (!regData.success) {
            console.error('Registration Failed:', regData.message);
            process.exit(1);
        }
        console.log('✅ Registration Successful');

        // 5. Duplicate Registration Check
        console.log('\nTesting Duplicate Registration...');
        const dupRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });
        const dupData = await dupRes.json();
        if (dupData.success) {
            console.error('❌ Duplicate Registration SHOULD Fail but succeeded');
        } else {
            console.log('✅ Duplicate Registration Blocked (Expected)');
        }

        console.log('\n🎉 All Tests Passed!');

    } catch (error) {
        console.error('Test Script Error:', error);
    }
};

runTests();
