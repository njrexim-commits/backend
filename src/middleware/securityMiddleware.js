import rateLimit from 'express-rate-limit';

/**
 * Standard rate limiter for public API endpoints.
 * Allows 100 requests per 15 minutes per IP.
 */
export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * stricter rate limiter for sensitive authentication endpoints.
 * Allows 5 attempts per 15 minutes per IP to prevent brute-force.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs for auth
    message: {
        message: 'Too many login attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter for content creation endpoints.
 * Allows 20 requests per hour per IP.
 */
export const contentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: {
        message: 'Content creation limit reached, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
