const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/clouddb');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';

    return {
      folder: 'catering',
      resource_type: isPdf ? 'raw' : 'image', // ✅ Correctly handle PDF vs Image
      type:"upload",
      format: isPdf ? 'pdf' : undefined, // optional
      public_id: file.originalname.split('.')[0], // optional: use filename without extension
    };
  },
});

const multerMiddleware = multer({ storage });

module.exports = multerMiddleware;
