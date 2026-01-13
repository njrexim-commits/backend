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
    } catch (error) {
        console.error('Failed to connect to database:', error);
        throw error;
    }
};

// Vercel serverless handler
const handler = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
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

// Export for Vercel
export default handler;
export { app };
