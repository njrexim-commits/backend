import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        await connectDB();
        isConnected = true;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Failed to connect to database:', error);
        // Don't throw in serverless - let requests fail gracefully
        if (!process.env.VERCEL) {
            throw error;
        }
    }
};

// For local development
if (!process.env.VERCEL) {
    const startServer = async () => {
        try {
            await connectToDatabase();
            app.listen(PORT, () => {
                console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            });
        } catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    };

    startServer();
}

// Vercel serverless handler
export default async (req, res) => {
    // Connect to database on first request
    await connectToDatabase();

    // Use the Express app's request handler
    // This is the correct way to invoke Express in serverless
    app.handle(req, res);
};

// Also export app for compatibility
export { app };
