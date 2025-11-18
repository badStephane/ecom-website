/**
 * Cloudinary Upload Service (via Backend)
 * Upload images through secure backend API
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const uploadImageToCloudinary = async (file, token) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('File size must be less than 50MB');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('image', file);

    // Upload via backend secure API
    const response = await fetch(`${BACKEND_URL}/api/upload/single`, {
      method: 'POST',
      headers: {
        'token': token,
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Upload failed');
    }

    return {
      url: data.data.url,
      publicId: data.data.publicId,
      width: data.data.width,
      height: data.data.height,
      size: data.data.size,
      format: data.data.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const uploadImageFromUrl = async (imageUrl, token) => {
  try {
    if (!imageUrl) {
      throw new Error('No URL provided');
    }

    // Validate URL format
    try {
      validateImageUrl(imageUrl);
    } catch {
      throw new Error('Invalid URL format');
    }

    // Upload via backend secure API using URL
    const response = await fetch(`${BACKEND_URL}/api/upload/from-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
      body: JSON.stringify({ url: imageUrl })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Upload failed');
    }

    return {
      url: data.data.url,
      publicId: data.data.publicId,
      width: data.data.width,
      height: data.data.height,
      size: data.data.size,
      format: data.data.format
    };
  } catch (error) {
    console.error('URL upload error:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files, token) => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadImageToCloudinary(file, token));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

// Delete image from Cloudinary via backend
export const deleteImageFromCloudinary = async (publicId, token) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/upload/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

// Dans votre contrôleur de produits
const validateImageUrl = (url) => {
  const allowedDomains = [
    'res.cloudinary.com',
    'yourdomain.com',
    'localhost' // pour le développement
  ];
  
  try {
    const parsed = new URL(url);
    return allowedDomains.some(domain => parsed.hostname.includes(domain));
  } catch {
    return false; // URL invalide
  }
};