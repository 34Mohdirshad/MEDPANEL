const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        let admin = await Admin.findOne({ username: username.trim() });
        if (!admin) {
            // BULLETPROOF FALLBACK: Final attempt to auto-activate admin if seed failed
            if (username.trim() === 'admin' && password === 'adminpassword123') {
                admin = new Admin({
                    username: 'admin',
                    email: 'admin@medical.com',
                    password: 'adminpassword123'
                });
                await admin.save();
                console.log('Production FORCE ACTIVATION: Admin created during login.');
            } else {
                return res.status(401).json({ message: 'Login Failed: Admin account not found in database.' });
            }
        }
        
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Login Failed: Incorrect password.' });
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'MedPortal_Secure_Secret_Default', { expiresIn: '1d' });
        res.json({ token, admin: { username: admin.username, email: admin.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const exists = await Admin.findOne({ $or: [{ username }, { email }] });
        if (exists) return res.status(400).json({ message: 'Already exists' });
        const admin = new Admin({ username, password, email });
        await admin.save();
        res.status(201).json({ message: 'Admin created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
