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
        settings.siteName = req.body.siteName !== undefined ? req.body.siteName : settings.siteName;
        settings.siteDescription = req.body.siteDescription !== undefined ? req.body.siteDescription : settings.siteDescription;
        settings.contactEmail = req.body.contactEmail !== undefined ? req.body.contactEmail : settings.contactEmail;
        settings.contactPhone = req.body.contactPhone !== undefined ? req.body.contactPhone : settings.contactPhone;
        settings.alternatePhone = req.body.alternatePhone !== undefined ? req.body.alternatePhone : settings.alternatePhone;
        settings.address = req.body.address !== undefined ? req.body.address : settings.address;
        settings.city = req.body.city !== undefined ? req.body.city : settings.city;
        settings.state = req.body.state !== undefined ? req.body.state : settings.state;
        settings.pincode = req.body.pincode !== undefined ? req.body.pincode : settings.pincode;
        settings.country = req.body.country !== undefined ? req.body.country : settings.country;
        settings.facebookUrl = req.body.facebookUrl !== undefined ? req.body.facebookUrl : settings.facebookUrl;
        settings.twitterUrl = req.body.twitterUrl !== undefined ? req.body.twitterUrl : settings.twitterUrl;
        settings.linkedinUrl = req.body.linkedinUrl !== undefined ? req.body.linkedinUrl : settings.linkedinUrl;
        settings.instagramUrl = req.body.instagramUrl !== undefined ? req.body.instagramUrl : settings.instagramUrl;
        settings.ogImageUrl = req.body.ogImageUrl !== undefined ? req.body.ogImageUrl : settings.ogImageUrl;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        const newSettings = await Settings.create(req.body);
        res.status(201).json(newSettings);
    }
});
