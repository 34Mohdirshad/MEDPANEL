const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const category = new Category({ name, slug, description });
        await category.save();
        res.status(201).json(category);
    } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const category = await Category.findByIdAndUpdate(req.params.id, { name, slug, description }, { new: true });
        res.json(category);
    } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (e) { res.status(500).json({ message: e.message }); }
};
