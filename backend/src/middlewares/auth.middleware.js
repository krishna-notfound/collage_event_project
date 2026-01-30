const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response.util');
const { db } = require('../config/firebase');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Verify admin exists in Firestore
            const adminRef = db.collection('admins').doc(decoded.id);
            const adminDoc = await adminRef.get();

            if (!adminDoc.exists) {
                return errorResponse(res, 401, 'Admin not found or access revoked');
            }

            req.admin = { id: adminDoc.id, ...adminDoc.data() };
            next();
        } catch (error) {
            console.error(error);
            return errorResponse(res, 401, 'Not authorized, token failed');
        }
    }

    if (!token) {
        return errorResponse(res, 401, 'Not authorized, no token');
    }
};

module.exports = { protect };
