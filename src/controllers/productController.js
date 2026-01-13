import asyncHandler from 'express-async-handler';
import { Product } from '../models/cmsModels.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, category, specifications, isFeatured } = req.body;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer, 'products');
            imageUrls.push(result.secure_url);
        }
    }

    const product = new Product({
        name,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description,
        category,
        images: imageUrls,
        specifications: specifications ? JSON.parse(specifications) : {},
        isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const { name, description, category, specifications, isFeatured } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.specifications = specifications ? JSON.parse(specifications) : product.specifications;
        product.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured;

        if (name) {
            product.slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        if (req.files && req.files.length > 0) {
            let newImageUrls = [];
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, 'products');
                newImageUrls.push(result.secure_url);
            }
            product.images = [...product.images, ...newImageUrls];
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});
