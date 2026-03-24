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

// PRE-MOUNT ROUTES (Must be before export for reliability)
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/files', fileRoutes);

// Diagnostic Health Check
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Medical Portal API is active (Consolidated)', 
        isVercel: !!process.env.VERCEL,
        mongoSet: !!process.env.MONGODB_URI
    });
});

app.get('/api/debug-db', async (req, res) => {
    try {
        await connectDB();
        const Admin = require('../server/models/Admin');
        const count = await Admin.countDocuments();
        res.json({ 
            status: 'Database OK', 
            adminCount: count, 
            mongoUriDefined: !!process.env.MONGODB_URI,
            nodeVersion: process.version
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'DB Diagnostic Failed', 
            details: err.message,
            stack: err.stack
        });
    }
});

module.exports = async (req, res) => {
    try {
        // Ensure connection on every request for serverless
        await connectDB();
        
        // Let Express handle the rest
        return app(req, res);
    } catch (err) {
        console.error('SERVERLESS_INVOCATION_ERROR:', err);
        return res.status(500).json({ 
            error: 'FATAL Serverless Error', 
            message: err.message 
        });
    }
};
