const { db, admin } = require('../config/firebase');
const { successResponse, errorResponse } = require('../utils/response.util');

// Create Event
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            startDate,
            endDate,
            venue,
            registrationDeadline,
            rules,
            schedule,
            coordinators,
            collegeId
        } = req.body;

        // Basic Validation
        if (!title || !startDate || !registrationDeadline) {
            return errorResponse(res, 400, 'Title, startDate, and registrationDeadline are required');
        }

        const eventData = {
            title,
            description: description || '',
            category: category || 'General',
            startDate,
            endDate: endDate || startDate,
            venue: venue || 'TBD',
            registrationDeadline,
            rules: rules || [],
            schedule: schedule || [],
            coordinators: coordinators || [],
            collegeId: collegeId || 'default-college', // In a multi-tenant app this would be dynamic
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('events').add(eventData);

        return successResponse(res, { id: docRef.id, ...eventData }, 'Event created successfully');

    } catch (error) {
        console.error('Create Event Error:', error);
        return errorResponse(res, 500, 'Failed to create event');
    }
};

// Update Event
const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const updates = req.body;

        if (!eventId) {
            return errorResponse(res, 400, 'Event ID is required');
        }

        updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        // Prevent updating critical immutable fields if any, or createdAt
        delete updates.createdAt;
        delete updates.id;

        const eventRef = db.collection('events').doc(eventId);
        const eventDoc = await eventRef.get();

        if (!eventDoc.exists) {
            return errorResponse(res, 404, 'Event not found');
        }

        await eventRef.update(updates);

        return successResponse(res, { id: eventId, ...updates }, 'Event updated successfully');

    } catch (error) {
        console.error('Update Event Error:', error);
        return errorResponse(res, 500, 'Failed to update event');
    }
};

// Delete Event
const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const eventRef = db.collection('events').doc(eventId);
        const eventDoc = await eventRef.get();

        if (!eventDoc.exists) {
            return errorResponse(res, 404, 'Event not found');
        }

        // Optional: Delete registrations associated with this event?
        // For now, just delete the event.
        await eventRef.delete();

        return successResponse(res, null, 'Event deleted successfully');

    } catch (error) {
        console.error('Delete Event Error:', error);
        return errorResponse(res, 500, 'Failed to delete event');
    }
};

// Public: Get All Events
const getEvents = async (req, res) => {
    try {
        const eventsRef = db.collection('events');
        const snapshot = await eventsRef.orderBy('startDate', 'asc').get();

        const events = [];
        const now = new Date();

        snapshot.forEach(doc => {
            const data = doc.data();
            const deadline = new Date(data.registrationDeadline);

            const status = now < deadline ? 'Open' : 'Closed';

            events.push({
                id: doc.id,
                ...data,
                status // Computed status
            });
        });

        return successResponse(res, events, 'Events fetched successfully');
    } catch (error) {
        console.error('Get Events Error:', error);
        return errorResponse(res, 500, 'Failed to fetch events');
    }
};

// Public: Get Single Event
const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;
        const eventRef = db.collection('events').doc(eventId);
        const eventDoc = await eventRef.get();

        if (!eventDoc.exists) {
            return errorResponse(res, 404, 'Event not found');
        }

        const data = eventDoc.data();
        const now = new Date();
        const deadline = new Date(data.registrationDeadline);
        const status = now < deadline ? 'Open' : 'Closed';

        return successResponse(res, { id: eventDoc.id, ...data, status }, 'Event details fetched');
    } catch (error) {
        console.error('Get Event Error:', error);
        return errorResponse(res, 500, 'Failed to fetch event');
    }
};

module.exports = {
    createEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    getEventById
};
