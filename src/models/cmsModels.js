import mongoose from 'mongoose';

// Blog Schema
const blogSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        image: { type: String }, // Cloudinary URL
        tags: [String],
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Product Schema
const productSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        images: [{ type: String }], // Array of Cloudinary URLs
        specifications: Map,
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Certificate Schema
const certificateSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        issuer: { type: String, required: true },
        issueDate: { type: Date },
        fileUrl: { type: String, required: true }, // Cloudinary URL (PDF/Image)
        thumbnail: { type: String },
    },
    { timestamps: true }
);

// Gallery Schema
const gallerySchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        imageUrl: { type: String, required: true },
        category: { type: String },
    },
    { timestamps: true }
);

// Inquiry Schema
const inquirySchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        subject: { type: String },
        message: { type: String, required: true },
        status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    },
    { timestamps: true }
);

// Testimonial Schema
const testimonialSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true }, // Not shown publicly
        rating: { type: Number, required: true, min: 1, max: 5 },
        content: { type: String, required: true },
        designation: { type: String },
        avatar: { type: String },
        isApproved: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
