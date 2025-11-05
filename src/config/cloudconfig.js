// [Imports remain the same]
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();
// [Validation remains the same]
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// [newsStorage and eventsStorage remain the same]
// ...
const newsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'aakar/news',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }, { quality: 'auto:good' }],
    resource_type: 'auto'
  }
});

const eventsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'aakar/events',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }, { quality: 'auto:good' }],
    resource_type: 'auto'
  }
});

// [fileFilter remains the same]
// ...
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files are allowed!'), false);
    return;
  }
  cb(null, true);
};

// --- START OF CHANGES ---

// --- 1. Uploader for News ---
export const uploadNews = multer({
  storage: newsStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
  fileFilter: fileFilter
});

// --- 2. Uploader for Events ---
export const uploadEvent = multer({
  storage: eventsStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
  fileFilter: fileFilter
});

// --- 3. Export the configured cloudinary object itself ---
export { cloudinary };

