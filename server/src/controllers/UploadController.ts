import { Request, Response, RequestHandler } from 'express';
import { upload } from '../config/cloudinary.js';

interface MulterFile extends Express.Multer.File {
  path: string;
}

// Upload multiple images to Cloudinary
export const uploadImages: RequestHandler = (req: Request, res: Response) => {
  // Multer middleware handles the upload and attaches files to req.files
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Image upload failed' });
    }

    const files = req.files as MulterFile[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    // Extract URLs from uploaded files
    const imageUrls = files.map((file) => file.path);

    res.status(200).json({
      message: 'Images uploaded successfully',
      imageUrls: imageUrls,
    });
  });
};

// Upload single image to Cloudinary (for avatar, cover, etc.)
export const uploadSingleImage: RequestHandler = (
  req: Request,
  res: Response,
) => {
  // Multer middleware handles the upload and attaches file to req.file
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Image upload failed' });
    }

    const file = req.file as MulterFile;

    if (!file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: file.path,
    });
  });
};
