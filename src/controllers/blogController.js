import asyncHandler from 'express-async-handler';
import { Blog } from '../models/cmsModels.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({}).populate('author', 'name');
    res.json(blogs);
});

// @desc    Get blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (blog) {
        res.json(blog);
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = asyncHandler(async (req, res) => {
    const { title, content, tags, isPublished } = req.body;

    let imageUrl = '';
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer, 'blogs');
        imageUrl = result.secure_url;
    }

    const blog = new Blog({
        title,
        slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        content,
        author: req.user._id,
        image: imageUrl,
        tags: tags ? tags.split(',') : [],
        isPublished: isPublished === 'true' || isPublished === true,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = asyncHandler(async (req, res) => {
    const { title, content, tags, isPublished } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (blog) {
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.tags = tags ? tags.split(',') : blog.tags;
        blog.isPublished = isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : blog.isPublished;

        if (title) {
            blog.slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'blogs');
            blog.image = result.secure_url;
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
        await blog.deleteOne();
        res.json({ message: 'Blog removed' });
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
});
