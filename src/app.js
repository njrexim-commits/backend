import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { mongoSanitize } from './middleware/mongoSanitize.js';
import xss from 'xss-clean';
import { publicLimiter } from './middleware/securityMiddleware.js';
import { errorHandler, notFound } from './middleware/error.js';

dotenv.config();

const app = express();

// 1. CORS Middleware (Should be first)
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(url => url.trim())
    : [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8080',
        'http://localhost:8081',
        'https://njrexim.com'
    ];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

// 2. Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize); // Prevent NoSQL injection (custom middleware)
app.use(xss()); // Sanitize user input (XSS protection)

// 3. Logger Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Rate Limiting
app.use('/api', publicLimiter);

// 5. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import productRoutes from './routes/productRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api', cmsRoutes); // for certificates, gallery, inquiries

app.get('/', (req, res) => {
    res.json({ message: 'NJR EXIM API is running...' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
