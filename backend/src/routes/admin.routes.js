const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const { createEvent, updateEvent, deleteEvent } = require('../controllers/event.controller');

// Public Admin Route
router.post('/login', loginAdmin);

// Protected Admin Routes (Event Management)
router.post('/events', protect, createEvent);
router.put('/events/:eventId', protect, updateEvent);
router.delete('/events/:eventId', protect, deleteEvent);

// View Event Registrations
const { getEventRegistrations } = require('../controllers/registration.controller');
router.get('/events/:eventId/registrations', protect, getEventRegistrations);

router.get('/dashboard', protect, (req, res) => {
    res.json({ success: true, message: `Welcome Admin ${req.admin.name}` });
});

module.exports = router;
