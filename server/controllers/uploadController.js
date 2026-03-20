const asyncHandler = require('express-async-handler');

// @desc    Return image URL as-is (no ImageKit, just proxy the URL)
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Convert buffer to base64 data URL (stored temporarily)
  const base64 = req.file.buffer.toString('base64');
  const mimeType = req.file.mimetype;
  const dataUrl = `data:${mimeType};base64,${base64}`;

  res.json({
    success: true,
    url: dataUrl,
    fileId: `local_${Date.now()}`,
  });
});

// @desc    Get upload auth (stub)
// @route   GET /api/upload/auth
// @access  Private/Admin
const getUploadAuth = asyncHandler(async (req, res) => {
  res.json({ success: true, data: {} });
});

module.exports = { uploadImage, getUploadAuth };