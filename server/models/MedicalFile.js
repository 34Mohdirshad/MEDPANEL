const mongoose = require('mongoose');

const MedicalFileSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    fileURL: { type: String, required: true },
    public_id: { type: String, required: true }, // For Cloudinary deletions
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    fileType: { type: String, enum: ['image', 'pdf', 'other'], default: 'image' },
    fileSize: { type: Number }, // in bytes
    uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MedicalFile', MedicalFileSchema);
