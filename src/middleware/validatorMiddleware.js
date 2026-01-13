/**
 * Middleware to validate request body against a Joi schema.
 * Rejects requests with unexpected fields and provides clear error messages.
 */
export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Include all errors
        allowUnknown: false, // Reject unexpected fields
        stripUnknown: true, // Remove unexpected fields (as a second layer)
    });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        res.status(400);
        throw new Error(`Validation Error: ${errorMessages.join(', ')}`);
    }

    // Replace req.body with sanitized and validated value
    req.body = value;
    next();
};
