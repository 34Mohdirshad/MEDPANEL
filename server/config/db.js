const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Category = require('../models/Category');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = !!db.connections[0].readyState;
        console.log('MongoDB connected');

        // Auto-seed default admin if not exists
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            await new Admin({
                username: 'admin',
                email: 'admin@medical.com',
                password: 'adminpassword123'
            }).save();
            console.log('Auto-seeded: Default Admin Created (admin / adminpassword123)');
        }

        // Auto-seed categories
        const categories = ['X-Ray', 'MRI Scan', 'CT Scan', 'Laboratory Report', 'Prescription', 'Physician Note'];
        for (const cat of categories) {
            const exists = await Category.findOne({ name: cat });
            if (!exists) {
                await new Category({ name: cat, slug: cat.toLowerCase().replace(/ /g, '-') }).save();
            }
        }
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // On Vercel, we don't want to process.exit(1) as it kills the function completely in a way that doesn't report well.
        throw err;
    }
};

module.exports = connectDB;
