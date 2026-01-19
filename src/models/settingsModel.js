import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema(
    {
        siteName: { type: String, default: 'NJR EXIM' },
        siteDescription: { type: String },
        contactEmail: { type: String },
        contactPhone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String },
        facebookUrl: { type: String },
        twitterUrl: { type: String },
        linkedinUrl: { type: String },
        instagramUrl: { type: String },
        ogImageUrl: { type: String },
    },
    { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export default Settings;
