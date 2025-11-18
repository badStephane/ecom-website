import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Upload a single image
 * @param {File} file - The image file to upload
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Upload result with image URL and metadata
 */
export const uploadSingleImage = async (file, token) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed");
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size exceeds 50MB limit");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(`${backendUrl}/api/upload/single`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: token,
      },
    });

    if (response.data.success) {
      return {
        success: true,
        url: response.data.data.url,
        publicId: response.data.data.publicId,
        format: response.data.data.format,
      };
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload multiple images
 * @param {Array<File>} files - Array of image files
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Array of upload results
 */
export const uploadMultipleImages = async (files, token) => {
  try {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    const formData = new FormData();
    files.forEach((file) => {
      // Validate each file
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type for ${file.name}`);
      }

      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File ${file.name} exceeds 50MB limit`);
      }

      formData.append("images", file);
    });

    const response = await axios.post(`${backendUrl}/api/upload/multiple`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: token,
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Multiple upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteImage = async (publicId, token) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

    const response = await axios.post(
      `${backendUrl}/api/upload/delete`,
      { publicId },
      {
        headers: {
          token: token,
        },
      }
    );

    if (response.data.success) {
      return {
        success: true,
        message: "Image deleted successfully",
      };
    } else {
      throw new Error(response.data.message || "Deletion failed");
    }
  } catch (error) {
    console.error("Deletion error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
};
