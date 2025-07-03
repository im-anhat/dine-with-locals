import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
// Initializes the Cloudinary client using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Storage Configuration for Multer (Middleware to handle multipart/form-data, used for uploading files)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});
const upload = multer({ storage: storage });
export { cloudinary, upload };
