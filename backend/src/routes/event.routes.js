const express = require('express');
const router = express.Router();
const { getEvents, getEventById } = require('../controllers/event.controller');

// Public Routes
router.get('/', getEvents);
router.get('/:eventId', getEventById);

module.exports = router;
