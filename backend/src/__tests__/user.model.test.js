import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Model Tests', () => {
  describe('User Creation', () => {
    it('should create a valid user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.firstName).toBe('John');
      expect(savedUser.lastName).toBe('Doe');
      expect(savedUser.email).toBe('john@example.com');
      expect(savedUser.role).toBe('customer'); // Default role
    });

    it('should reject user without firstName', async () => {
      const userData = {
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should reject user without email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should reject user with invalid email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    it('should reject duplicate email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user1 = new User(userData);
      await user1.save();

      const user2 = new User(userData);
      
      await expect(user2.save()).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      await user.save();

      // Password should be hashed, not plain text
      expect(user.password).not.toBe('SecurePass123!');
      expect(user.password).toBeDefined();
    });

    it('should hash password on password update', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      await user.save();

      const originalHash = user.password;

      user.password = 'NewSecurePass456!';
      await user.save();

      expect(user.password).not.toBe('NewSecurePass456!');
      expect(user.password).not.toBe(originalHash);
    });
  });

  describe('matchPassword Method', () => {
    it('should return true for correct password', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.matchPassword('SecurePass123!');
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.matchPassword('WrongPassword123!');
      expect(isMatch).toBe(false);
    });
  });

  describe('Default Values', () => {
    it('should have default role as "user"', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      await user.save();

      expect(user.role).toBe('customer');
    });

    it('should have isActive as true by default', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      await user.save();

      expect(user.isActive).toBe(true);
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      await user.save();

      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.createdAt instanceof Date).toBe(true);
      expect(user.updatedAt instanceof Date).toBe(true);
    });

    it('should update updatedAt on modification', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      const user = new User(userData);
      await user.save();

      const originalUpdatedAt = user.updatedAt;

      // Wait a bit and update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      user.firstName = 'Jane';
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email formats', async () => {
      const validEmails = [
        'user@example.com',
        'username@domain.co.uk',
        'test@mail.org'
      ];

      for (const email of validEmails) {
        const user = new User({
          firstName: 'John',
          lastName: 'Doe',
          email,
          password: 'SecurePass123!'
        });

        await expect(user.save()).resolves.toBeDefined();
        await User.deleteMany({});
      }
    });

    it('should reject invalid email formats', async () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@example.com',
        'user@.com'
      ];

      for (const email of invalidEmails) {
        const user = new User({
          firstName: 'John',
          lastName: 'Doe',
          email,
          password: 'SecurePass123!'
        });

        await expect(user.save()).rejects.toThrow();
      }
    });

    it('should normalize email to lowercase', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'USER@EXAMPLE.COM',
        password: 'SecurePass123!'
      });

      await user.save();

      expect(user.email).toBe('user@example.com');
    });
  });
});
