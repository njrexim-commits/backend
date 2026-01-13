/**
 * Custom MongoDB sanitization middleware compatible with Express v5
 * Removes $ and . characters from user input to prevent NoSQL injection
 */
export const mongoSanitize = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => sanitize(item));
        }

        const sanitized = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Remove keys that start with $ or contain .
                const sanitizedKey = key.replace(/^\$/, '').replace(/\./g, '');
                sanitized[sanitizedKey] = sanitize(obj[key]);
            }
        }
        return sanitized;
    };

    // Sanitize request body
    if (req.body) {
        req.body = sanitize(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
        const sanitizedQuery = sanitize(req.query);
        // Replace the query object properties instead of the object itself
        Object.keys(req.query).forEach(key => delete req.query[key]);
        Object.assign(req.query, sanitizedQuery);
    }

    // Sanitize URL parameters
    if (req.params) {
        req.params = sanitize(req.params);
    }

    next();
};
