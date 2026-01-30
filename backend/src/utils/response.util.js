/**
 * Standard API Response Structure
 * @param {boolean} success - Request success status
 * @param {any} data - Data to return (for success)
 * @param {string} message - Message (optional for success, required for error)
 */
const apiResponse = (res, statusCode, success, data = null, message = '') => {
    const response = {
        success: success,
    };

    if (data !== null) {
        response.data = data;
    }

    if (message) {
        response.message = message;
    }

    return res.status(statusCode).json(response);
};

const successResponse = (res, data, message = 'Success') => {
    return apiResponse(res, 200, true, data, message);
};

const errorResponse = (res, statusCode, message) => {
    return apiResponse(res, statusCode, false, null, message);
};

module.exports = {
    successResponse,
    errorResponse
};
