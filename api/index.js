const connectDB = require('../server/config/db');
const app = require('../server/index.js');

module.exports = async (req, res) => {
    try {
        await connectDB();
        // Since app is an express instance, it can handle (req, res)
        return app(req, res);
    } catch (err) {
        console.error('Database connection error in Vercel function:', err);
        res.status(500).json({ error: "Internal Server Error: Database Connection Failed" });
    }
};
