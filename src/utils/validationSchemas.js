import Joi from 'joi';

/**
 * Authentication Schemas
 */
export const loginSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().min(6).required(),
});

export const setupSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().min(8).required(),
});

/**
 * CMS Content Schemas
 */
export const blogSchema = Joi.object({
    title: Joi.string().min(5).max(150).required().trim(),
    slug: Joi.string().min(5).max(150).required().trim(),
    content: Joi.string().min(10).required(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    isPublished: Joi.boolean().optional(),
    // Author is usually taken from req.user
});

export const productSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().trim(),
    slug: Joi.string().min(2).max(100).required().trim(),
    description: Joi.string().min(10).max(2000).required().trim(),
    category: Joi.string().required().trim(),
    specifications: Joi.object().optional(),
    isFeatured: Joi.boolean().optional(),
});

export const inquirySchema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    phone: Joi.string().min(10).max(15).pattern(/^[+0-9\s-]+$/).optional().allow(''),
    subject: Joi.string().min(3).max(100).optional().trim().allow(''),
    message: Joi.string().min(10).max(1000).required().trim(),
    status: Joi.string().valid('new', 'read', 'replied').optional(),
});

export const certificateSchema = Joi.object({
    title: Joi.string().min(2).max(100).required().trim(),
    issuer: Joi.string().min(2).max(100).required().trim(),
    issueDate: Joi.date().optional(),
});

export const gallerySchema = Joi.object({
    title: Joi.string().min(2).max(100).required().trim(),
    category: Joi.string().optional().trim().allow(''),
});

export const testimonialSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    rating: Joi.number().min(1).max(5).required(),
    content: Joi.string().min(10).max(500).required().trim(),
    designation: Joi.string().max(50).optional().trim().allow(''),
});

/**
 * Settings Schema
 */
export const settingsSchema = Joi.object({
    siteName: Joi.string().max(50).optional().trim(),
    siteDescription: Joi.string().max(500).optional().trim(),
    contactEmail: Joi.string().email().optional().lowercase().trim(),
    contactPhone: Joi.string().max(20).optional().trim(),
    address: Joi.string().max(200).optional().trim(),
    city: Joi.string().max(100).optional().trim(),
    state: Joi.string().max(100).optional().trim(),
    pincode: Joi.string().max(20).optional().trim(),
    country: Joi.string().max(100).optional().trim(),
    facebookUrl: Joi.string().uri().optional().allow(''),
    twitterUrl: Joi.string().uri().optional().allow(''),
    linkedinUrl: Joi.string().uri().optional().allow(''),
    instagramUrl: Joi.string().uri().optional().allow(''),
});
