const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageDirectory = path.join(__dirname, '../../../client/public/images');

// Ensure folder exists (so you don't get ENOENT again)
if (!fs.existsSync(imageDirectory)) {
  fs.mkdirSync(imageDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDirectory);
  },
  filename: (req, file, cb) => {
    // 1. Clean the filename (remove spaces/weird chars)
    const cleanName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, cleanName);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  // 2. Return the clean URL
  // If the file already existed, the URL is the same, so no new space is taken!
  const fileUrl = `/images/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

module.exports = router;