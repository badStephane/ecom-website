/**
 * Hook personnalisé pour la validation des formulaires
 */
export const useFormValidation = () => {
  /**
   * Valide un email
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Valide la force d'un mot de passe
   * Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
   */
  const validatePassword = (password) => {
    if (!password || password.length < 8) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  /**
   * Valide un nom (2-50 caractères, lettres uniquement)
   */
  const validateName = (name) => {
    if (!name || name.length < 2 || name.length > 50) return false;
    return /^[a-zA-Z\s'-]+$/.test(name);
  };

  /**
   * Valide un numéro de téléphone
   */
  const validatePhone = (phone) => {
    if (!phone) return true; // Optionnel
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    return phoneRegex.test(phone);
  };

  /**
   * Valide une adresse
   */
  const validateAddress = (address) => {
    if (!address) return true; // Optionnel
    return address.length <= 100;
  };

  /**
   * Valide la correspondance de deux mots de passe
   */
  const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  /**
   * Valide la force du mot de passe et retourne un message
   */
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 'none', message: 'Entrez un mot de passe' };
    
    if (password.length < 8) {
      return { strength: 'weak', message: 'Minimum 8 caractères requis' };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    if (strength === 4) {
      return { strength: 'strong', message: 'Mot de passe fort' };
    } else if (strength >= 3) {
      return { strength: 'medium', message: 'Mot de passe moyen' };
    } else {
      return { strength: 'weak', message: 'Mot de passe faible' };
    }
  };

  return {
    validateEmail,
    validatePassword,
    validateName,
    validatePhone,
    validateAddress,
    validatePasswordMatch,
    getPasswordStrength
  };
};
