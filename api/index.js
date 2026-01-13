// Vercel serverless function handler
export default async (req, res) => {
    try {
        // Dynamic imports to catch initialization errors
        const connectDB = (await import('../src/config/db.js')).default;
        const app = (await import('../src/app.js')).default;

        await connectDB();

        // Let Express handle all requests
        return new Promise((resolve, reject) => {
            app(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
    } catch (error) {
        console.error('Critical Serverless Startup Error:', error);
        // Send a 500 response with error details (safe for admin debugging)
        res.status(500).json({
            error: 'Server Startup Failed',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
