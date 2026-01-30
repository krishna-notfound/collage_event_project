const express = require('express');
const router = express.Router();
const { registerForEvent, getStudentRegistrations } = require('../controllers/registration.controller');

// Public
router.post('/register', registerForEvent);
router.get('/my-registrations', getStudentRegistrations);

module.exports = router;
