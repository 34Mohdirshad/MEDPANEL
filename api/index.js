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

// Database connection logic for serverless
let cachedHandler = null;

module.exports = async (req, res) => {
    try {
        await connectDB();
        
        // Define routes inside the handler wrapper if needed, 
        // but easier to just use the express app directly.
        // We'll re-mount routes here for complete isolation inside the lambda
        
        // Local health check
        if (req.url === '/api' || req.url === '/api/') {
            return res.json({ message: 'MedPortal API is active (Serverless)', db: 'connected' });
        }
        
        // Manual routing for common paths if Express has issues with rewrites
        // (Just a backup, Express usually handles it)
        
        return app(req, res);
    } catch (err) {
        console.error('SERVERLESS_ERROR:', err);
        return res.status(500).json({ 
            error: 'Serverless Function Error', 
            details: err.message,
            hint: 'Check MONGODB_URI and Atlas Whitelist (0.0.0.0/0)'
        });
    }
};

// Mount routes on the app instance
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/files', fileRoutes);

// Health check and Debug
app.get('/api/debug-db', async (req, res) => {
    try {
        const Admin = require('../server/models/Admin');
        const count = await Admin.countDocuments();
        res.json({ adminCount: count, status: 'Database reach OK' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
