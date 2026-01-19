import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';
import { generateEmailHtml } from '../utils/emailTemplates.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Setup initial super admin
// @route   POST /api/auth/setup
// @access  Public
export const setupSuperAdmin = asyncHandler(async (req, res) => {
    const userExists = await User.findOne({});
    if (userExists) {
        res.status(400);
        throw new Error('Setup already completed. Users already exist.');
    }

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role: 'super-admin',
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    await user.save();

    const origin = req.get('Origin');
    const frontendUrl = origin || process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/admin/reset-password?token=${resetToken}`;

    const emailContent = `
        <h1>Password Reset Request</h1>
        <p>You have requested a password reset for your <strong>NJR EXIM</strong> account.</p>
        <p>Please click the button below to reset your password:</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, please ignore this email.</p>
    `;

    const html = await generateEmailHtml('Password Reset Request', emailContent);

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message: html,
            text: `You have requested a password reset. Please copy and paste this link to reset your password: ${resetUrl}`,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
        success: true,
        data: 'Password reset success',
        token: generateToken(user._id),
    });
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};
