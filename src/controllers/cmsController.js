import asyncHandler from 'express-async-handler';
import { Certificate, Gallery, Inquiry } from '../models/cmsModels.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// --- Certificate Controllers ---
export const getCertificates = asyncHandler(async (req, res) => {
    const certificates = await Certificate.find({});
    res.json(certificates);
});

export const createCertificate = asyncHandler(async (req, res) => {
    const { title, issuer, issueDate } = req.body;
    if (!req.file) {
        res.status(400);
        throw new Error('Certificate file is required');
    }

    const result = await uploadToCloudinary(req.file.buffer, 'certificates');

    const certificate = new Certificate({
        title,
        issuer,
        issueDate,
        fileUrl: result.secure_url,
        thumbnail: result.secure_url.replace(/\.pdf$/, '.jpg'), // Basic thumbnail hack for Cloudinary
    });

    const createdCertificate = await certificate.save();
    res.status(201).json(createdCertificate);
});

export const deleteCertificate = asyncHandler(async (req, res) => {
    const certificate = await Certificate.findById(req.params.id);
    if (certificate) {
        await certificate.deleteOne();
        res.json({ message: 'Certificate removed' });
    } else {
        res.status(404);
        throw new Error('Certificate not found');
    }
});

// --- Gallery Controllers ---
export const getGalleryItems = asyncHandler(async (req, res) => {
    const items = await Gallery.find({});
    res.json(items);
});

export const createGalleryItem = asyncHandler(async (req, res) => {
    const { title, category } = req.body;
    if (!req.file) {
        res.status(400);
        throw new Error('Image file is required');
    }

    const result = await uploadToCloudinary(req.file.buffer, 'gallery');

    const item = new Gallery({
        title,
        category,
        imageUrl: result.secure_url,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
    const item = await Gallery.findById(req.params.id);
    if (item) {
        await item.deleteOne();
        res.json({ message: 'Gallery item removed' });
    } else {
        res.status(404);
        throw new Error('Gallery item not found');
    }
});

// --- Inquiry Controllers ---
export const getInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
});

export const createInquiry = asyncHandler(async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    const inquiry = new Inquiry({ name, email, phone, subject, message });
    const createdInquiry = await inquiry.save();
    res.status(201).json(createdInquiry);
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
        inquiry.status = req.body.status || inquiry.status;
        const updatedInquiry = await inquiry.save();
        res.json(updatedInquiry);
    } else {
        res.status(404);
        throw new Error('Inquiry not found');
    }
});

export const deleteInquiry = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
        await inquiry.deleteOne();
        res.json({ message: 'Inquiry removed' });
    } else {
        res.status(404);
        throw new Error('Inquiry not found');
    }
});
