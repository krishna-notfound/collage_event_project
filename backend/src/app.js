const express = require('express');
const cors = require('cors');
const { successResponse, errorResponse } = require('./utils/response.util');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/', (req, res) => {
    return successResponse(res, { status: 'online' }, 'College Event Backend is Running');
});

// Routes will be mounted here
const adminRoutes = require('./routes/admin.routes');
const eventRoutes = require('./routes/event.routes');
const registrationRoutes = require('./routes/registration.routes');

app.use('/admin', adminRoutes);
app.use('/events', eventRoutes);
app.use('/', registrationRoutes);

// 404 Handler
app.use((req, res, next) => {
    return errorResponse(res, 404, 'Route not found');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    return errorResponse(res, 500, 'Internal Server Error');
});

module.exports = app;
