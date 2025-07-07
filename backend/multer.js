const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1234567890.jpg
  },
});

// File filter: Accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept
  } else {
    cb(new Error("Only images are allowed"), false); // Reject
  }
};

// Initialize multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;
