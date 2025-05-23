import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./storage";
import { fileURLToPath } from 'url';
import { uploadImageToCloudinary, isCloudinaryConfigured } from "./cloudinary";

// Get current directory path (ESM compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      // Generate a unique filename
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept only images
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: Images Only!"));
  },
});

export const uploadSingleImage = (req: Request, res: Response, next: NextFunction) => {
  const uploadHandler = upload.single("file");
  
  uploadHandler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    try {
      // Get the alt text from the request
      const alt = req.body.alt || req.file.originalname;
      let imageUrl = '';
      let cloudinaryPublicId = '';
      
      // Check if Cloudinary is configured
      if (isCloudinaryConfigured()) {
        try {
          console.log("Using Cloudinary for image upload");
          // Upload to Cloudinary
          const cloudinaryResult = await uploadImageToCloudinary(req.file.path, 'hill-country');
          imageUrl = cloudinaryResult.url;
          cloudinaryPublicId = cloudinaryResult.public_id;
          
          // Delete local file after Cloudinary upload
          fs.unlinkSync(req.file.path);
        } catch (cloudinaryError) {
          console.error("Cloudinary upload failed, falling back to local storage", cloudinaryError);
          // Fall back to local storage if Cloudinary fails
          const relativePath = `/uploads/${req.file.filename}`;
          const serverUrl = `${req.protocol}://${req.get("host")}`;
          imageUrl = `${serverUrl}${relativePath}`;
        }
      } else {
        console.log("Cloudinary not configured, using local storage");
        // Use local storage if Cloudinary is not configured
        const relativePath = `/uploads/${req.file.filename}`;
        const serverUrl = `${req.protocol}://${req.get("host")}`;
        imageUrl = `${serverUrl}${relativePath}`;
      }
      
      // Store the image in the database
      const image = await storage.createImage({
        url: imageUrl,
        alt: alt,
        cloudinaryId: cloudinaryPublicId || undefined
      });
      
      res.status(201).json(image);
    } catch (error) {
      // If there's an error, delete the uploaded file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  });
};