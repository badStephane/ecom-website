import express from "express";
import { uploadSingle, uploadMultiple } from "../middlewares/uploadMiddleware.js";
import { uploadImage, uploadMultipleImages, deleteImage } from "../utils/cloudinary.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/upload/single
 * @desc    Upload a single image
 * @access  Private (Admin only)
 */
router.post("/single", authMiddleware, uploadSingle, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to upload images",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Pass true for isLocalFile since this is uploaded via multer
    const result = await uploadImage(req.file.path, "livewear", true);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed",
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images
 * @access  Private (Admin only)
 */
router.post("/multiple", authMiddleware, uploadMultiple, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to upload images",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files provided",
      });
    }

    const filePaths = req.files.map((file) => file.path);
    // Pass true for isLocalFile since these are uploaded via multer
    const results = await uploadMultipleImages(filePaths, "livewear", true);

    const failedUploads = results.filter((r) => !r.success);
    if (failedUploads.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${failedUploads.length} image(s) failed to upload`,
        data: results,
      });
    }

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/upload/from-url
 * @desc    Upload image from URL
 * @access  Private (Admin only)
 */
router.post("/from-url", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to upload images",
      });
    }

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // Validate URL format
    try {
      const parsedUrl = new URL(url);
      
      // Additional security: only allow http/https protocols
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return res.status(400).json({
          success: false,
          message: "Only HTTP and HTTPS URLs are allowed",
        });
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    // Pass false for isLocalFile since this is a URL
    const result = await uploadImage(url, "livewear", false);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed",
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/upload/delete
 * @desc    Delete image from Cloudinary
 * @access  Private (Admin only)
 */
router.post("/delete", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete images",
      });
    }

    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    // Validate publicId format to prevent injection attacks
    // Cloudinary public IDs should only contain alphanumeric, hyphens, underscores, and slashes
    const validPublicIdPattern = /^[a-zA-Z0-9\/_-]+$/;
    if (!validPublicIdPattern.test(publicId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid public ID format",
      });
    }

    const result = await deleteImage(publicId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Image deletion failed",
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;