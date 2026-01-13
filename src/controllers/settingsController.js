import asyncHandler from 'express-async-handler';
import Settings from '../models/settingsModel.js';

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
    }
    res.json(settings);
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/SuperAdmin
export const updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    if (settings) {
        settings.siteName = req.body.siteName || settings.siteName;
        settings.siteDescription = req.body.siteDescription || settings.siteDescription;
        settings.contactEmail = req.body.contactEmail || settings.contactEmail;
        settings.contactPhone = req.body.contactPhone || settings.contactPhone;
        settings.address = req.body.address || settings.address;
        settings.facebookUrl = req.body.facebookUrl || settings.facebookUrl;
        settings.twitterUrl = req.body.twitterUrl || settings.twitterUrl;
        settings.linkedinUrl = req.body.linkedinUrl || settings.linkedinUrl;
        settings.instagramUrl = req.body.instagramUrl || settings.instagramUrl;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        const newSettings = await Settings.create(req.body);
        res.status(201).json(newSettings);
    }
});
