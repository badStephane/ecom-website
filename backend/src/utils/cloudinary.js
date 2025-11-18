import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary from URL or file path
 * @param {string} filePath - Path to the file or URL
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Object>} - Upload result with URL and public ID
 */
export const uploadImage = async (filePath, folder = "livewear") => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary configuration not found");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
    });

    // If file was uploaded from local storage, delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<string>} filePaths - Array of file paths
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Array>} - Array of upload results
 */
export const uploadMultipleImages = async (filePaths, folder = "livewear") => {
  try {
    const results = [];
    
    for (const filePath of filePaths) {
      const result = await uploadImage(filePath, folder);
      results.push(result);
    }
    
    return results;
  } catch (error) {
    console.error("Multiple upload error:", error);
    return [];
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    return {
      success: result.result === "ok",
      result: result.result,
    };
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs
 * @returns {Promise<Array>} - Array of deletion results
 */
export const deleteMultipleImages = async (publicIds) => {
  try {
    const results = [];
    
    for (const publicId of publicIds) {
      const result = await deleteImage(publicId);
      results.push(result);
    }
    
    return results;
  } catch (error) {
    console.error("Multiple deletion error:", error);
    return [];
  }
};

export default cloudinary;
