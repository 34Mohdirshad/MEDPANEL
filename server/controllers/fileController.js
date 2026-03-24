const MedicalFile = require('../models/MedicalFile');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;

exports.uploadFile = async (req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        if (!req.file) return res.status(400).json({ message: 'File is required' });

        const newFile = new MedicalFile({
            title,
            description,
            categoryId,
            category: categoryId,
            fileURL: req.file.path,
            public_id: req.file.filename,
            fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'image',
            fileSize: req.file.size
        });

        await newFile.save();
        res.status(201).json(newFile);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const { category, search, startDate, endDate } = req.query;
        let query = {};

        if (category && category !== 'All') {
            const cat = await Category.findOne({ name: category });
            if (cat) query.category = cat._id;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (startDate || endDate) {
            query.uploadDate = {};
            if (startDate) query.uploadDate.$gte = new Date(startDate);
            if (endDate) query.uploadDate.$lte = new Date(endDate);
        }

        const files = await MedicalFile.find(query).populate('category').sort({ uploadDate: -1 });
        res.json(files);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.updateFile = async (req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        const file = await MedicalFile.findByIdAndUpdate(req.params.id, 
            { title, description, category: categoryId }, 
            { new: true }
        );
        res.json(file);
    } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.deleteFile = async (req, res) => {
    try {
        const file = await MedicalFile.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(file.public_id);
        
        await MedicalFile.findByIdAndDelete(req.params.id);
        res.json({ message: 'File deleted' });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getStats = async (req, res) => {
    try {
        const totalUploads = await MedicalFile.countDocuments();
        const categoryStats = await MedicalFile.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $project: {
                    name: "$categoryDetails.name",
                    count: 1
                }
            }
        ]);
        res.json({ totalUploads, categoryStats });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
