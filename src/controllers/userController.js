import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';
import { generateEmailHtml } from '../utils/emailTemplates.js';

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/SuperAdmin
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/SuperAdmin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'super-admin') {
            res.status(400);
            throw new Error('Cannot delete a super admin');
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user by Super Admin (change role etc)
// @route   PUT /api/auth/users/:id
// @access  Private/SuperAdmin
export const updateUserBySuperAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Invite new user
// @route   POST /api/auth/invite
// @access  Private/SuperAdmin
export const inviteUser = asyncHandler(async (req, res) => {
    const { email, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Generate token
    const invitationToken = crypto.randomBytes(20).toString('hex');
    const invitationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user with dummy password (will be set by user)
    const user = await User.create({
        name: 'Invited User', // Placeholder
        email,
        password: await bcrypt.hash(crypto.randomBytes(10).toString('hex'), 10), // Random temporary password
        role,
        invitationToken,
        invitationExpires,
        isInvited: true,
    });

    if (user) {
        // Send email
        const origin = req.get('Origin');
        const frontendUrl = origin || process.env.FRONTEND_URL || 'http://localhost:5173';
        const inviteUrl = `${frontendUrl}/admin/setup-invite?token=${invitationToken}`;

        try {
            const emailContent = `
                <h1>Welcome to NJR EXIM Admin Panel</h1>
                <p>You have been invited to join as an <strong>${role}</strong>.</p>
                <p>Please click the button below to set your password and activate your account:</p>
                <a href="${inviteUrl}" class="button">Accept Invitation</a>
                <p>Or copy and paste this link:</p>
                <p><a href="${inviteUrl}">${inviteUrl}</a></p>
                <p>This link will expire in 24 hours.</p>
            `;

            const html = await generateEmailHtml('Admin Invitation', emailContent);

            await sendEmail({
                email: user.email,
                subject: 'Admin Invitation - NJR EXIM',
                message: html,
                text: `Welcome to NJR EXIM Admin Panel. You have been invited to join as an ${role}. Please copy and paste this link to accept the invitation: ${inviteUrl}`,
            });
            res.status(201).json({ message: `Invitation sent to ${email}` });
        } catch (error) {
            await user.deleteOne(); // Rollback if email fails
            res.status(500);
            throw new Error('Email could not be sent');
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Accept invitation and set password
// @route   POST /api/auth/accept-invite
// @access  Public
export const acceptInvite = asyncHandler(async (req, res) => {
    const { token, password, name } = req.body;

    const user = await User.findOne({
        invitationToken: token,
        invitationExpires: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired invitation token');
    }

    user.password = password; // Will be hashed by pre-save hook
    user.name = name;
    user.invitationToken = undefined;
    user.invitationExpires = undefined;
    user.isInvited = false;

    await user.save();

    res.json({ message: 'Account activated successfully. You can now login.' });
});
