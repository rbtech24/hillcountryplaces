import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./storage";
import { fileURLToPath } from 'url';

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
      
      // Create a URL path for the image
      const relativePath = `/uploads/${req.file.filename}`;
      const serverUrl = `${req.protocol}://${req.get("host")}`;
      const imageUrl = `${serverUrl}${relativePath}`;
      
      // Store the image in the database
      const image = await storage.createImage({
        url: imageUrl,
        alt: alt
      });
      
      res.status(201).json(image);
    } catch (error) {
      // If there's an error, delete the uploaded file
      fs.unlinkSync(req.file.path);
      next(error);
    }
  });
};