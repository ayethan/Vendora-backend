const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // You might want to store different types of uploads in different folders
    // For now, let's use a generic 'uploads' folder
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent overwrites
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Configure file filter (optional: to allow only specific file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
  }
};

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB file size limit
  }
});

module.exports = upload;
