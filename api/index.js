require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../server/config/db');
const authRoutes = require('../server/routes/authRoutes');
const categoryRoutes = require('../server/routes/categoryRoutes');
const fileRoutes = require('../server/routes/fileRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// LOGGING (Only for server console)
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// MOUNT ROUTES Double-Mount pattern for cloud stability
// Handles both /api/auth and /auth relative paths
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/files', fileRoutes);
app.use('/api/files', fileRoutes);

// Health check and Diagnostic
app.get(['/api', '/api/debug-db', '/debug-db'], async (req, res) => {
    try {
        await connectDB();
        const Admin = require('../server/models/Admin');
        const count = await Admin.countDocuments();
        res.json({ 
            status: 'Database reach OK', 
            adminCount: count, 
            mongoUriDefined: !!process.env.MONGODB_URI,
            vercelEnv: !!process.env.VERCEL,
            reqPath: req.url
        });
    } catch (err) {
        res.status(500).json({ error: err.message, path: req.url });
    }
});

module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (err) {
        return res.status(500).json({ error: 'Serverless Invocation Fatal', details: err.message });
    }
};
