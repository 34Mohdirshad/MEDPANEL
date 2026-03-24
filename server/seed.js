require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Category = require('./models/Category');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB...');

        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const admin = new Admin({
                username: 'admin',
                email: 'admin@medical.com',
                password: 'adminpassword123' // This will be hashed by the model pre-save hook
            });
            await admin.save();
            console.log('Default Admin Created: admin / adminpassword123');
        }

        const categories = ['X-Ray', 'MRI Scan', 'CT Scan', 'Laboratory Report', 'Prescription', 'Physician Note'];
        for (const cat of categories) {
            const exists = await Category.findOne({ name: cat });
            if (!exists) {
                const slug = cat.toLowerCase().replace(/ /g, '-');
                await new Category({ name: cat, slug }).save();
                console.log(`Category Created: ${cat}`);
            }
        }

        console.log('Seeding complete! You can now login to the Admin Panel.');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seed();
