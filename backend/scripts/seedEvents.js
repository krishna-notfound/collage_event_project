const { db, admin } = require('../src/config/firebase');

const seedEvents = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        const events = [
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
            },
            {
                title: 'TechNova 2026',
                tagline: 'Annual technical festival showcasing innovation',
                category: 'techfest',
                bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
                date: '2026-02-20',
                startDate: '2026-02-20T10:00:00.000Z',
                time: '10:00 AM - 06:00 PM',
                venue: 'College Campus',
                registrationDeadline: '2026-02-18T23:59:59.000Z',
                description: 'TechNova is our flagship technical festival featuring workshops, competitions, and exhibitions. Experience the latest in technology, participate in exciting challenges, and learn from industry leaders.',
                rules: [
                    'Valid college ID mandatory for entry',
                    'Follow event-specific rules for each competition'
                ],
                eligibility: [
                    'Open to all college students'
                ],
                schedule: [
                    { time: '10:00 AM', activity: 'Inauguration', location: 'Main Stage' }
                ],
                coordinators: [
                    { name: 'Amit Kumar', role: 'Festival Director', phone: '+91 98765 43212', email: 'amit.kumar@college.edu' }
                ],
                registrationStatus: 'open',
                isFree: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            },
            {
                title: 'Cultural Night 2026',
                tagline: 'A celebration of art, music, and dance',
                category: 'cultural',
                bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
                date: '2026-02-25',
                startDate: '2026-02-25T18:00:00.000Z',
                time: '06:00 PM - 10:00 PM',
                venue: 'Open Air Theatre',
                registrationDeadline: '2026-02-22T23:59:59.000Z',
                description: 'An evening of cultural performances featuring dance, music, drama, and fashion. Show off your talents and celebrate the rich cultural diversity of our college!',
                rules: [
                    'Performance duration: 5-10 minutes',
                    'Pre-registration required for performers'
                ],
                eligibility: [
                    'Open to all students'
                ],
                schedule: [
                    { time: '06:00 PM', activity: 'Gates Open', location: 'Main Entrance' }
                ],
                coordinators: [
                    { name: 'Sneha Reddy', role: 'Cultural Secretary', phone: '+91 98765 43213', email: 'sneha.reddy@college.edu' }
                ],
                registrationStatus: 'upcoming',
                isFree: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }
        ];

        const batch = db.batch();

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
