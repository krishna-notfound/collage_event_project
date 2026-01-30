const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/response.util');

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 400, 'Please provide email and password');
        }

        // Find admin by email
        const adminsRef = db.collection('admins');
        const snapshot = await adminsRef.where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        const adminDoc = snapshot.docs[0];
        const adminData = adminDoc.data();

        // Check password
        const isMatch = await bcrypt.compare(password, adminData.passwordHash);

        if (!isMatch) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        // Generate Token
        const token = jwt.sign({ id: adminDoc.id, email: adminData.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return successResponse(res, {
            token,
            admin: {
                id: adminDoc.id,
                name: adminData.name,
                email: adminData.email
            }
        }, 'Login successful');

    } catch (error) {
        console.error('Login Error:', error);
        return errorResponse(res, 500, 'Server Error');
    }
};

module.exports = {
    loginAdmin
};
