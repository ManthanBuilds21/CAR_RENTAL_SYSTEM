const express = require('express');
const router = express.Router();
const { uploadImage, getUploadAuth } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, adminOnly, upload.single('image'), uploadImage);
router.get('/auth', protect, adminOnly, getUploadAuth);

module.exports = router;
