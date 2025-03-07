import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Configura dotenv
dotenv.config();

// Log delle variabili d'ambiente per il debug
console.log('CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Blog',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// Configura multer con CloudinaryStorage
const upload = multer({ storage: storage });

export default upload;