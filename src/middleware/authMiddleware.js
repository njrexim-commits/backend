import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// Note: express-async-handler is not installed yet, let me use a simple try-wrap or install it.
// Actually, I'll just write a simple wrapper or use standard try-catch for now to avoid too many installs.
// Wait, I'll install it as it's very useful.

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};

export const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

export const superAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'super-admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as a super admin');
    }
};
