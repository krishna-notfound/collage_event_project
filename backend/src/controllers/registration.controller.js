const { db, admin } = require('../config/firebase');
const { successResponse, errorResponse } = require('../utils/response.util');

// Register for Event
const registerForEvent = async (req, res) => {
    const { name, email, rollNumber, department, year, eventId } = req.body;

    if (!name || !email || !rollNumber || !department || !year || !eventId) {
        return errorResponse(res, 400, 'All fields are required');
    }

    const dbInstance = db; // Alias to avoid confusion

    try {
        await dbInstance.runTransaction(async (t) => {
            // 1. Check Event Exists & Status
            const eventRef = dbInstance.collection('events').doc(eventId);
            const eventDoc = await t.get(eventRef);

            if (!eventDoc.exists) {
                throw new Error('Event not found');
            }

            const eventData = eventDoc.data();
            const deadline = new Date(eventData.registrationDeadline);
            const now = new Date();

            if (now >= deadline) {
                throw new Error('Registration closed');
            }

            // 2. Check/Create Student (by email) - In a real app we might update if exists, here we ensure it exists.
            // We assume email is unique.
            const studentsRef = dbInstance.collection('students');
            const studentQuery = await t.get(studentsRef.where('email', '==', email).limit(1));

            let studentId;

            if (studentQuery.empty) {
                // Create new student
                const newStudentRef = studentsRef.doc();
                studentId = newStudentRef.id;
                t.set(newStudentRef, {
                    name,
                    email,
                    rollNumber,
                    department,
                    year,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
            } else {
                studentId = studentQuery.docs[0].id;
            }

            // 3. Check Duplicate Registration
            // We need a composite key or a query. Firestore queries inside transaction must be on documents read.
            // Since registrations can be many, we might want to query registrations collection.
            // However, typical firestore pattern for uniqueness: Use a deterministic ID or query.
            // Querying registrations where studentId == X and eventId == Y

            const registrationsRef = dbInstance.collection('registrations');
            // Note: You must read BEFORE write.
            const duplicateCheck = await t.get(registrationsRef
                .where('studentId', '==', studentId)
                .where('eventId', '==', eventId)
            );

            if (!duplicateCheck.empty) {
                throw new Error('Already registered for this event');
            }

            // 4. Create Registration
            const newRegRef = registrationsRef.doc();
            t.set(newRegRef, {
                studentId,
                eventId,
                registeredAt: admin.firestore.FieldValue.serverTimestamp(),
                // storing denormalized data can be useful but minimal is fine
                studentName: name,
                eventTitle: eventData.title
            });

        });

        return successResponse(res, null, 'Registration successful');

    } catch (error) {
        console.error('Registration Transaction Error:', error);
        // Determine if it's our error or system error
        if (error.message === 'Event not found' || error.message === 'Registration closed' || error.message === 'Already registered for this event') {
            return errorResponse(res, 400, error.message);
        }
        return errorResponse(res, 500, 'Registration failed');
    }
};

// Get Student Registrations
const getStudentRegistrations = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return errorResponse(res, 400, 'Email is required');
        }

        // 1. Get Student ID
        const studentsRef = db.collection('students');
        const studentSnapshot = await studentsRef.where('email', '==', email).limit(1).get();

        if (studentSnapshot.empty) {
            // No student found => no registrations
            return successResponse(res, [], 'No registrations found');
        }

        const studentId = studentSnapshot.docs[0].id;

        // 2. Get Registrations
        const registrationsRef = db.collection('registrations');
        const regSnapshot = await registrationsRef.where('studentId', '==', studentId).get();

        if (regSnapshot.empty) {
            return successResponse(res, [], 'No registrations found');
        }

        // 3. Fetch Event Details for each registration
        // Can be done in parallel
        const promises = regSnapshot.docs.map(async (doc) => {
            const regData = doc.data();
            const eventDoc = await db.collection('events').doc(regData.eventId).get();
            if (eventDoc.exists) {
                const eventData = eventDoc.data();
                // Compute Status again? or just return basic info
                return {
                    registrationId: doc.id,
                    registeredAt: regData.registeredAt,
                    event: {
                        id: eventDoc.id,
                        title: eventData.title,
                        date: eventData.startDate,
                        venue: eventData.venue
                    }
                };
            }
            return null;
        });

        const results = await Promise.all(promises);
        const validResults = results.filter(r => r !== null);

        return successResponse(res, validResults, 'Registrations fetched');

    } catch (error) {
        console.error('My Registrations Error:', error);
        return errorResponse(res, 500, 'Failed to fetch registrations');
    }
};

// Admin: View Event Registrations
const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Check event exists?
        // Let's just query registrations
        const registrationsRef = db.collection('registrations');
        const snapshot = await registrationsRef.where('eventId', '==', eventId).get();

        const registrations = [];
        // We might want student details.

        const promises = snapshot.docs.map(async doc => {
            const regData = doc.data();
            const studentDoc = await db.collection('students').doc(regData.studentId).get();
            const studentData = studentDoc.exists ? studentDoc.data() : { name: 'Unknown' };

            return {
                id: doc.id,
                registeredAt: regData.registeredAt,
                student: studentData
            };
        });

        const results = await Promise.all(promises);

        return successResponse(res, results, 'Registrations fetched');
    } catch (error) {
        console.error('Admin Event Reg Error:', error);
        return errorResponse(res, 500, 'Failed to fetch registrations');
    }
};

module.exports = {
    registerForEvent,
    getStudentRegistrations,
    getEventRegistrations
};
