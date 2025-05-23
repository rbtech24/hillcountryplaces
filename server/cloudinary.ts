import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload an image file to Cloudinary
 * @param filePath Path to the local image file
 * @param folder Cloudinary folder to store the image in
 * @returns Cloudinary upload result with image URL
 */
export async function uploadImageToCloudinary(filePath: string, folder = 'hill-country'): Promise<{ url: string, public_id: string }> {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
    });

    // Return the Cloudinary URL and public_id
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId The public_id of the image to delete
 * @returns Success status
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Check if Cloudinary is properly configured
 * @returns Boolean indicating if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}