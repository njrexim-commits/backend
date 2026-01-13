import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Database connection state
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        await connectDB();
        isConnected = true;
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

// Vercel serverless function handler
export default async (req, res) => {
    await connectToDatabase();

    // Let Express handle all requests
    return new Promise((resolve, reject) => {
        app(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};
