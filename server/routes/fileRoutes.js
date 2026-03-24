const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { upload } = require('../config/cloudinary');
const auth = require('../middleware/auth');

router.get('/', fileController.getFiles);
router.get('/stats', auth, fileController.getStats);
router.post('/upload', auth, upload.single('file'), fileController.uploadFile);
router.put('/:id', auth, fileController.updateFile);
router.delete('/:id', auth, fileController.deleteFile);

module.exports = router;
