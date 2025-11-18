/**
 * Validateurs pour les fichiers
 */

// Types MIME autorisés
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Tailles maximales (en bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Valide un fichier image
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  // Vérifier le type MIME
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    };
  }

  // Vérifier la taille
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image size must not exceed ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    };
  }

  return { valid: true };
};

/**
 * Valide un fichier document
 */
export const validateDocumentFile = (file) => {
  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  // Vérifier le type MIME
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid document type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`
    };
  }

  // Vérifier la taille
  if (file.size > MAX_DOCUMENT_SIZE) {
    return {
      valid: false,
      error: `Document size must not exceed ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB`
    };
  }

  return { valid: true };
};

/**
 * Middleware pour valider les fichiers uploadés
 */
export const validateUploadedFile = (allowedTypes, maxSize) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;

    // Vérifier le type MIME
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    // Vérifier la taille
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size must not exceed ${maxSize / (1024 * 1024)}MB`
      });
    }

    // Vérifier l'extension du fichier
    const allowedExtensions = allowedTypes.map(type => {
      const ext = type.split('/')[1];
      return ext === 'vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'docx' : ext;
    });

    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Nettoie le nom du fichier pour éviter les injections
 */
export const sanitizeFileName = (fileName) => {
  // Supprimer les caractères dangereux
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
};

/**
 * Génère un nom de fichier unique
 */
export const generateUniqueFileName = (originalFileName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalFileName.split('.').pop();
  const baseName = sanitizeFileName(originalFileName.replace(`.${extension}`, ''));
  
  return `${baseName}_${timestamp}_${random}.${extension}`;
};
