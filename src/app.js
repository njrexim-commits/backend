import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/error.js';

dotenv.config();

const app = express();

import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/products', productRoutes);
app.use('/api', cmsRoutes); // for certificates, gallery, inquiries

app.get('/', (req, res) => {
    res.json({ message: 'NJR EXIM API is running...' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
