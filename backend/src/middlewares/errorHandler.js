/**
 * Wrapper pour les contrôleurs asynchrones
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Middleware de gestion des erreurs centralisée
 */
export const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Erreurs de validation Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // Erreurs de clé unique Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      ...(isDevelopment && { stack: err.stack })
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // Erreurs de cast Mongoose
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // Erreurs personnalisées
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(isDevelopment && { stack: err.stack })
    });
  }

  // Erreurs par défaut
  const statusCode = err.statusCode || 500;
  const message = isDevelopment ? err.message : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && { stack: err.stack })
  });
};

/**
 * Middleware pour les routes non trouvées
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
