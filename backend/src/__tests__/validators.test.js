import { body, validationResult } from 'express-validator';

describe('Validators Tests', () => {
  describe('Email Validation', () => {
    it('should accept valid email', async () => {
      const req = {
        body: {
          email: 'user@example.com'
        }
      };

      const validation = body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail();

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const req = {
        body: {
          email: 'invalid-email'
        }
      };

      const validation = body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail();

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty email', async () => {
      const req = {
        body: {
          email: ''
        }
      };

      const validation = body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail();

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should normalize email', async () => {
      const req = {
        body: {
          email: '  USER@EXAMPLE.COM  '
        }
      };

      const validation = body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail();

      await validation.run(req);

      expect(req.body.email).toBe('user@example.com');
    });
  });

  describe('Password Validation', () => {
    it('should accept strong password', async () => {
      const req = {
        body: {
          password: 'SecurePass123!'
        }
      };

      const validation = body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject password without uppercase', async () => {
      const req = {
        body: {
          password: 'securepass123!'
        }
      };

      const validation = body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject password without lowercase', async () => {
      const req = {
        body: {
          password: 'SECUREPASS123!'
        }
      };

      const validation = body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject password without number', async () => {
      const req = {
        body: {
          password: 'SecurePass!'
        }
      };

      const validation = body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject password without special character', async () => {
      const req = {
        body: {
          password: 'SecurePass123'
        }
      };

      const validation = body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject password less than 8 characters', async () => {
      const req = {
        body: {
          password: 'Pass1!'
        }
      };

      const validation = body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty password', async () => {
      const req = {
        body: {
          password: ''
        }
      };

      const validation = body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('Name Validation', () => {
    it('should accept valid first name', async () => {
      const req = {
        body: {
          firstName: 'John'
        }
      };

      const validation = body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
        .isLength({ max: 50 }).withMessage('First name must not exceed 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should accept names with hyphens and apostrophes', async () => {
      const req = {
        body: {
          firstName: "Jean-Pierre O'Brien"
        }
      };

      const validation = body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
        .isLength({ max: 50 }).withMessage('First name must not exceed 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject name with numbers', async () => {
      const req = {
        body: {
          firstName: 'John123'
        }
      };

      const validation = body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
        .isLength({ max: 50 }).withMessage('First name must not exceed 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject name less than 2 characters', async () => {
      const req = {
        body: {
          firstName: 'J'
        }
      };

      const validation = body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
        .isLength({ max: 50 }).withMessage('First name must not exceed 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject empty name', async () => {
      const req = {
        body: {
          firstName: ''
        }
      };

      const validation = body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
        .isLength({ max: 50 }).withMessage('First name must not exceed 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    it('should accept valid phone number', async () => {
      const req = {
        body: {
          phone: '+1 (555) 123-4567'
        }
      };

      const validation = body('phone')
        .notEmpty().withMessage('Phone number is required')
        .trim()
        .matches(/^[\d\s\-+()]{10,}$/).withMessage('Please provide a valid phone number');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should accept phone without special characters', async () => {
      const req = {
        body: {
          phone: '5551234567'
        }
      };

      const validation = body('phone')
        .notEmpty().withMessage('Phone number is required')
        .trim()
        .matches(/^[\d\s\-+()]{10,}$/).withMessage('Please provide a valid phone number');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should reject empty phone (required)', async () => {
      const req = {
        body: {
          phone: ''
        }
      };

      const validation = body('phone')
        .notEmpty().withMessage('Phone number is required')
        .trim()
        .matches(/^[\d\s\-+()]{10,}$/).withMessage('Please provide a valid phone number');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject phone with letters', async () => {
      const req = {
        body: {
          phone: '555ABC1234'
        }
      };

      const validation = body('phone')
        .notEmpty().withMessage('Phone number is required')
        .trim()
        .matches(/^[\d\s\-+()]{10,}$/).withMessage('Please provide a valid phone number');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });

    it('should reject phone less than 10 characters', async () => {
      const req = {
        body: {
          phone: '12345'
        }
      };

      const validation = body('phone')
        .notEmpty().withMessage('Phone number is required')
        .trim()
        .matches(/^[\d\s\-+()]{10,}$/).withMessage('Please provide a valid phone number');

      await validation.run(req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).toBe(false);
    });
  });
});
