const { db, admin } = require('../src/config/firebase');

const seedEvents = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        const events = [
            {
                title: 'Web-X Design',
                tagline: 'Full-stack web development competition',
                category: 'hackathon',
                bannerImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
                date: '2026-01-30',
                startDate: '2026-01-30T12:00:00.000Z',
                time: '12:00 PM - 06:00 PM',
                venue: 'CSED Udyamee Chaupal & Aarambh Hall',
                registrationDeadline: '2026-01-29T23:59:59.000Z',
                description: 'Web-X design is an exciting full-stack web development competition designed to test participants\' coding, design, and problem-solving skills. Teams or individuals will create a complete web application, tackling real-world challenges within a set timeframe. Cash prize worth Rs. 15,000!',
                rules: [
                    'Team Size: 1 to 4 participants',
                    'A real-world problem statement will be provided at the start',
                    'Must be full-stack (frontend + backend) with clear integration',
                    'Use of modern frameworks (React, Angular, Vue, Node.js, Python) encouraged',
                    'External APIs and libraries allowed',
                    'Must be fully functional and deployable'
                ],
                eligibility: [
                    'Open to all students',
                    'Laptop required'
                ],
                schedule: [
                    { time: '12:00 PM', activity: 'Problem Statement Release', location: 'Aarambh Hall' },
                    { time: '06:00 PM', activity: 'Submission Deadline', location: 'Online' }
                ],
                coordinators: [
                    { name: 'Dr. Shubham Mishra', role: 'Faculty Coordinator', phone: '9616304550', email: 'shubham.mishra@college.edu' },
                    { name: 'Shailesh Gole', role: 'Student Coordinator', phone: '7582865878', email: 'shailesh.gole@student.edu' }
                ],
                registrationStatus: 'open',
                isFree: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            },
            {
                title: 'Proj-E-X',
                tagline: 'A Project Exhibition showcasing innovation',
                category: 'techfest',
                bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
                date: '2026-01-30',
                startDate: '2026-01-30T10:00:00.000Z',
                time: '10:00 AM - 06:00 PM',
                venue: 'KC Ground',
                description: 'Project Expo is a dynamic exhibition for university students to showcase their innovative projects—from models and apps to designs, robots, and groundbreaking ideas. Highlighting themes like AI for Safety, Democratizing AI, and Agentic AI. Cash prize worth Rs. 1,00,000!',
                rules: [
                    'Team Size: 2 to 4 participants',
                    'Projects should demonstrate innovation (hardware, software, or both)',
                    'Live demonstration required during exhibition',
                    'Maximum 10 minutes to present to jury',
                    'Must stay at exhibit throughout the event'
                ],
                eligibility: [
                    'Open to all university students',
                    'Prototype/Model required'
                ],
                schedule: [
                    { time: '10:00 AM', activity: 'Exhibition Opens', location: 'KC Ground' },
                    { time: '06:00 PM', activity: 'Exhibition Closes', location: 'KC Ground' }
                ],
                coordinators: [
                    { name: 'Dr. Sayantan Sinha', role: 'Faculty Coordinator', phone: '8617707685', email: 'sayantan.sinha@college.edu' },
                    { name: 'Pragati Varshney', role: 'Student Coordinator', phone: '8533861697', email: 'pragati.varshney@student.edu' }
                ],
                registrationStatus: 'open',
                isFree: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            },
            {
                title: 'HackFest 2026',
                tagline: '24-hour coding marathon to build innovative solutions',
                category: 'hackathon',
                bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
                date: '2026-02-15',
                startDate: '2026-02-15T09:00:00.000Z',
                time: '09:00 AM - 09:00 AM (Next Day)',
                venue: 'Main Auditorium, Block A',
                registrationDeadline: '2026-02-10T23:59:59.000Z',
                description: 'Join us for an exhilarating 24-hour hackathon where teams compete to build innovative solutions to real-world problems. Network with industry experts, win exciting prizes, and showcase your coding skills!',
                rules: [
                    'Team size: 2-4 members',
                    'All team members must be current students',
                    'Projects must be built from scratch during the event',
                    'Use of open-source libraries is allowed',
                    'Plagiarism will result in immediate disqualification'
                ],
                eligibility: [
                    'Open to all undergraduate and postgraduate students',
                    'Basic programming knowledge required',
                    'Must bring your own laptop'
                ],
                schedule: [
                    { time: '09:00 AM', activity: 'Registration & Check-in', location: 'Lobby' },
                    { time: '10:00 AM', activity: 'Opening Ceremony', location: 'Main Auditorium' },
                    { time: '11:00 AM', activity: 'Hacking Begins', location: 'Labs 1-5' }
                ],
                coordinators: [
                    { name: 'Rahul Sharma', role: 'Lead Coordinator', phone: '+91 98765 43210', email: 'rahul.sharma@college.edu' }
                ],
                registrationStatus: 'open',
                isFree: false,
                price: 200,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }
        ];

        const batch = db.batch();

        // Optional: Delete existing events to avoid duplicates (for development safety)
        const snapshot = await db.collection('events').get();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        events.forEach((event) => {
            const docRef = db.collection('events').doc();
            batch.set(docRef, event);
        });

        await batch.commit();
        console.log('✅ Successfully seeded ' + events.length + ' events!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedEvents();
