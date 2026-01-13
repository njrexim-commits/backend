import express from 'express';
import { getPages, getPageBySlug, updatePage, createPage } from '../controllers/pageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getPages)
    .post(protect, admin, createPage);

router.route('/:slug')
    .get(getPageBySlug)
    .put(protect, admin, updatePage);

export default router;
