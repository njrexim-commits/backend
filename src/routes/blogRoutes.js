import express from 'express';
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validatorMiddleware.js';
import { blogSchema } from '../utils/validationSchemas.js';
import { contentLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getBlogs)
    .post(protect, admin, contentLimiter, upload.single('image'), validate(blogSchema), createBlog);

router.route('/:id')
    .get(getBlogById)
    .put(protect, admin, upload.single('image'), validate(blogSchema), updateBlog)
    .delete(protect, admin, deleteBlog);

export default router;
