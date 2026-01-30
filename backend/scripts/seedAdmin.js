const { db } = require('../src/config/firebase');
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
    try {
        const email = 'admin@college.edu';
        const password = 'admin123'; // Change this!
        const name = 'Super Admin';

        // Check if exists
        const snapshot = await db.collection('admins').where('email', '==', email).get();
        if (!snapshot.empty) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await db.collection('admins').add({
            name,
            email,
            passwordHash,
            createdAt: new Date()
        });

        console.log(`Admin created: ${email} / ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin', error);
        process.exit(1);
    }
};

seedAdmin();
