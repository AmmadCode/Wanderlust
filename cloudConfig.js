const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_listings', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'], // Allowed image formats
        transformation: [
            {
                width: 1200,
                height: 800,
                crop: 'limit', // Maintains aspect ratio
                quality: 'auto:best', // Auto quality optimization
                fetch_format: 'auto' // Auto format selection (webp, etc.)
            }
        ]
    }
});

// Add file size limit (5MB = 5 * 1024 * 1024 bytes)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Export configured instances
module.exports = {
    cloudinary,
    storage,
    upload // Export upload instance with limits
};