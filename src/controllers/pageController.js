import Page from '../models/pageModel.js';

// @desc    Get all pages content
// @route   GET /api/pages
// @access  Public
export const getPages = async (req, res) => {
    try {
        const pages = await Page.find({ isActive: true });
        res.json(pages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single page content by slug
// @route   GET /api/pages/:slug
// @access  Public
export const getPageBySlug = async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug });
        if (page) {
            res.json(page);
        } else {
            res.status(404).json({ message: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update page content
// @route   PUT /api/pages/:slug
// @access  Private/Admin
export const updatePage = async (req, res) => {
    try {
        const { title, content, isActive } = req.body;
        const page = await Page.findOne({ slug: req.params.slug });

        if (page) {
            page.title = title || page.title;
            page.content = content || page.content;
            page.isActive = isActive !== undefined ? isActive : page.isActive;

            const updatedPage = await page.save();
            res.json(updatedPage);
        } else {
            res.status(404).json({ message: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new page content
// @route   POST /api/pages
// @access  Private/Admin
export const createPage = async (req, res) => {
    try {
        const { title, slug, content } = req.body;
        const pageExists = await Page.findOne({ slug });

        if (pageExists) {
            res.status(400).json({ message: 'Page already exists' });
            return;
        }

        const page = await Page.create({
            title,
            slug,
            content
        });

        res.status(201).json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
