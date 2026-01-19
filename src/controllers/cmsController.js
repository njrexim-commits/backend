import asyncHandler from 'express-async-handler';
import { Certificate, Gallery, Inquiry, Blog, Product, Testimonial } from '../models/cmsModels.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';
import sendEmail from '../utils/sendEmail.js';
import { generateEmailHtml } from '../utils/emailTemplates.js';

// --- Generic Upload Controller ---
export const uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('File is required');
    }

    const folder = req.body.folder || 'uploads';
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.status(201).json({ url: result.secure_url });
});

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

    // Send Auto-Reply to User
    try {
        const emailContent = `
            <h1>Thank You, ${name}!</h1>
            <p>We have received your inquiry regarding "<strong>${subject || 'General Inquiry'}</strong>".</p>
            <p>One of our representatives will review your message and get back to you shortly.</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>NJR EXIM Team</strong></p>
        `;

        const html = await generateEmailHtml('We Received Your Inquiry', emailContent);

        await sendEmail({
            email,
            subject: 'We Received Your Inquiry - NJR EXIM',
            message: html,
            text: `Thank You, ${name}! We have received your inquiry regarding "${subject || 'General Inquiry'}". One of our representatives will review your message and get back to you shortly.\n\nBest Regards,\nNJR EXIM Team`,
        });
    } catch (error) {
        console.error('Email sending failed:', error);
        // Don't fail the request if email fails
    }

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

// --- Testimonial Controllers ---
export const createTestimonial = asyncHandler(async (req, res) => {
    const { name, email, rating, content, designation } = req.body;

    const testimonial = new Testimonial({
        name,
        email,
        rating,
        content,
        designation,
    });

    const createdTestimonial = await testimonial.save();

    // Send Auto-Reply to User
    try {
        const emailContent = `
            <h1>Thank You, ${name}!</h1>
            <p>We truly appreciate you taking the time to review your experience with NJR EXIM.</p>
            <p>Your review has been submitted for moderation and will be visible on our website shortly after approval.</p>
            <br>
            <p>Warm Regards,</p>
            <p><strong>NJR EXIM Team</strong></p>
        `;

        const html = await generateEmailHtml('Thanks for Your Review!', emailContent);

        await sendEmail({
            email,
            subject: 'Thanks for Your Review! - NJR EXIM',
            message: html,
            text: `Thank You, ${name}! We truly appreciate you taking the time to review your experience with NJR EXIM. Your review has been submitted for moderation and will be visible on our website shortly after approval.\n\nWarm Regards,\nNJR EXIM Team`,
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }

    res.status(201).json(createdTestimonial);
});

export const getPublicTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(testimonials);
});

export const getAllTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
});

export const updateTestimonialStatus = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
        testimonial.isApproved = req.body.isApproved;
        const updatedTestimonial = await testimonial.save();
        res.json(updatedTestimonial);
    } else {
        res.status(404);
        throw new Error('Testimonial not found');
    }
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
        await testimonial.deleteOne();
        res.json({ message: 'Testimonial removed' });
    } else {
        res.status(404);
        throw new Error('Testimonial not found');
    }
});

// --- Dashboard Activity ---
export const getRecentActivity = asyncHandler(async (req, res) => {
    const [blogs, products, inquiries, galleries, testimonials] = await Promise.all([
        Blog.find({}).sort({ createdAt: -1 }).limit(5),
        Product.find({}).sort({ createdAt: -1 }).limit(5),
        Inquiry.find({}).sort({ createdAt: -1 }).limit(5),
        Gallery.find({}).sort({ createdAt: -1 }).limit(5),
        Testimonial.find({}).sort({ createdAt: -1 }).limit(5)
    ]);

    const activities = [
        ...blogs.map(b => ({
            id: b._id,
            type: 'content',
            message: 'New blog post',
            detail: b.title,
            time: b.createdAt
        })),
        ...products.map(p => ({
            id: p._id,
            type: 'product',
            message: 'Product added',
            detail: p.name,
            time: p.createdAt
        })),
        ...inquiries.map(i => ({
            id: i._id,
            type: 'inquiry',
            message: 'New inquiry',
            detail: `From ${i.name}`,
            time: i.createdAt
        })),
        ...testimonials.map(t => ({
            id: t._id,
            type: 'testimonial',
            message: `New review (${t.rating}★)`,
            detail: `From ${t.name}`,
            time: t.createdAt
        }))
    ];

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(activities.slice(0, 10));
});
