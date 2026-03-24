require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Medical Portal API is active',
        environment: process.env.VERCEL ? 'production' : 'local' 
    });
});

// Debug Route (temporary for testing)
app.get('/api/debug-db', async (req, res) => {
    try {
        const Admin = require('./models/Admin');
        const count = await Admin.countDocuments();
        res.json({ message: 'Database check', adminCount: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Main Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
