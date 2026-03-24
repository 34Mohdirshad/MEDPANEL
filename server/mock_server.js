const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer();

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'mock_db.json');

// Initialize Mock DB if not exists
if (!fs.existsSync(DB_PATH)) {
    const initialData = {
        admins: [{ username: "admin", password: "adminpassword123" }],
        categories: [
            { _id: "c1", name: "X-Ray", slug: "x-ray", description: "Radiological imaging" },
            { _id: "c2", name: "MRI Scan", slug: "mri", description: "Magnetic Resonance Imaging" }
        ],
        files: [
            { 
                _id: "f1", 
                title: "Brain MRI - Patient A", 
                description: "T2 weighted axial scan showing normal findings.", 
                fileURL: "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                fileType: "image",
                category: { _id: "c2", name: "MRI Scan" },
                uploadDate: new Date().toISOString(),
                fileSize: 1048576
            }
        ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Auth
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const db = getDB();
    const admin = db.admins.find(a => a.username === username && a.password === password);
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ username }, "mock_secret");
    res.json({ token, admin: { username: admin.username } });
});

// Categories
app.get('/api/categories', (req, res) => res.json(getDB().categories));
app.post('/api/categories', (req, res) => {
    const db = getDB();
    const newCat = { _id: "c"+Date.now(), ...req.body, slug: req.body.name.toLowerCase().replace(/ /g, '-') };
    db.categories.push(newCat);
    saveDB(db);
    res.json(newCat);
});
app.put('/api/categories/:id', (req, res) => {
    const db = getDB();
    const index = db.categories.findIndex(c => c._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Not found" });
    db.categories[index] = { ...db.categories[index], ...req.body, slug: req.body.name.toLowerCase().replace(/ /g, '-') };
    saveDB(db);
    res.json(db.categories[index]);
});
app.delete('/api/categories/:id', (req, res) => {
    const db = getDB();
    db.categories = db.categories.filter(c => c._id !== req.params.id);
    // Also clean up files in this category
    db.files = db.files.map(f => f.category?._id === req.params.id ? { ...f, category: null } : f);
    saveDB(db);
    res.json({ message: "Deleted" });
});

// Files
app.get('/api/files', (req, res) => {
    const db = getDB();
    let files = db.files;
    const { category, search } = req.query;
    if (category && category !== 'All') {
        files = files.filter(f => f.category && f.category.name === category);
    }
    if (search) {
        files = files.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));
    }
    res.json(files);
});

app.post('/api/files/upload', upload.any(), (req, res) => {
    const db = getDB();
    const cat = db.categories.find(c => c._id === req.body.categoryId);
    const newFile = {
        _id: "f"+Date.now(),
        ...req.body,
        category: cat,
        fileURL: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        fileType: "image",
        uploadDate: new Date().toISOString(),
        fileSize: 2048576
    };
    db.files.push(newFile);
    saveDB(db);
    res.json(newFile);
});

app.put('/api/files/:id', (req, res) => {
    const db = getDB();
    const index = db.files.findIndex(f => f._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Not found" });
    const cat = db.categories.find(c => c._id === req.body.categoryId);
    db.files[index] = { ...db.files[index], ...req.body, category: cat };
    saveDB(db);
    res.json(db.files[index]);
});

app.get('/api/files/stats', (req, res) => {
    const db = getDB();
    const totalUploads = db.files.length;
    const categoryStats = db.categories.map(c => ({
        name: c.name,
        count: db.files.filter(f => f.category?._id === c._id).length
    }));
    res.json({ totalUploads, categoryStats });
});

app.delete('/api/files/:id', (req, res) => {
    const db = getDB();
    db.files = db.files.filter(f => f._id !== req.params.id);
    saveDB(db);
    res.json({ message: "Deleted" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 MOCK WORKING MODE active on Port ${PORT}`));
