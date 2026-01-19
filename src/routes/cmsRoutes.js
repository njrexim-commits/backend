import express from 'express';
import {
    getCertificates, createCertificate, deleteCertificate,
    getGalleryItems, createGalleryItem, deleteGalleryItem,
    getInquiries, createInquiry, updateInquiryStatus, deleteInquiry,
    getRecentActivity,
    createTestimonial, getPublicTestimonials, getAllTestimonials, updateTestimonialStatus, deleteTestimonial,
    uploadFile
} from '../controllers/cmsController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, admin, superAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validatorMiddleware.js';
import {
    certificateSchema, gallerySchema, inquirySchema, settingsSchema, testimonialSchema
} from '../utils/validationSchemas.js';
import { contentLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Activity Feed
router.get('/activity', protect, admin, getRecentActivity);

// Generic Upload
router.post('/upload', protect, admin, contentLimiter, upload.single('file'), uploadFile);

// Site Settings
router.route('/settings')
    .get(getSettings)
    .put(protect, superAdmin, validate(settingsSchema), updateSettings);

// Certificate routes
router.route('/certificates')
    .get(getCertificates)
    .post(protect, admin, contentLimiter, upload.single('file'), validate(certificateSchema), createCertificate);

router.route('/certificates/:id')
    .delete(protect, admin, deleteCertificate);

// Gallery routes
router.route('/gallery')
    .get(getGalleryItems)
    .post(protect, admin, contentLimiter, upload.single('image'), validate(gallerySchema), createGalleryItem);

router.route('/gallery/:id')
    .delete(protect, admin, deleteGalleryItem);

// Inquiry routes
router.route('/inquiries')
    .get(protect, admin, getInquiries)
    .post(contentLimiter, validate(inquirySchema), createInquiry);

router.route('/inquiries/:id')
    .put(protect, admin, updateInquiryStatus)
    .delete(protect, admin, deleteInquiry);

// Testimonial routes
router.route('/testimonials')
    .get(getPublicTestimonials)
    .post(contentLimiter, validate(testimonialSchema), createTestimonial);

router.route('/testimonials/admin')
    .get(protect, admin, getAllTestimonials);

router.route('/testimonials/:id')
    .put(protect, admin, updateTestimonialStatus)
    .delete(protect, admin, deleteTestimonial);

export default router;
