/**
 * Valide et nettoie les URLs d'images pour prévenir les XSS
 * @param {string} url - URL à valider
 * @returns {string} - URL sécurisée ou placeholder
 */
export const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '/images/placeholder.jpg';
  }

  // Bloquer les URLs dangereuses
  const dangerousPatterns = [
    /^javascript:/i,
    /^data:text\/html/i,
    /^vbscript:/i,
    /^onload=/i,
    /^onerror=/i,
    /^onclick=/i,
    /<\/script>/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(url)) {
      console.warn('URL dangereuse bloquée:', url);
      return '/images/placeholder.jpg';
    }
  }

  // N'autoriser que les URLs HTTP/HTTPS et les chemins relatifs
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }

  // Bloquer les URLs avec des caractères suspects
  if (url.includes('\\') || url.includes('../') || url.includes('<!--')) {
    return '/images/placeholder.jpg';
  }

  return '/images/placeholder.jpg';
};

/**
 * Valide si une URL est sécurisée pour les images
 */
export const isValidImageUrl = (url) => {
  const sanitized = sanitizeImageUrl(url);
  return sanitized !== '/images/placeholder.jpg';
};