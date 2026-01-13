import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validatorMiddleware.js';
import { productSchema } from '../utils/validationSchemas.js';
import { contentLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, contentLimiter, upload.array('images', 5), validate(productSchema), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.array('images', 5), validate(productSchema), updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;
