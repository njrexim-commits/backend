import express from 'express';
import {
    getCertificates, createCertificate, deleteCertificate,
    getGalleryItems, createGalleryItem, deleteGalleryItem,
    getInquiries, createInquiry, updateInquiryStatus, deleteInquiry
} from '../controllers/cmsController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, admin, superAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validatorMiddleware.js';
import {
    certificateSchema, gallerySchema, inquirySchema, settingsSchema
} from '../utils/validationSchemas.js';
import { contentLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

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

export default router;
