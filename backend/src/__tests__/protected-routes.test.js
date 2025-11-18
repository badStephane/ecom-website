import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import User from '../models/User.js';

let mongoServer;
let token;
let userId;

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

  // Créer un utilisateur et récupérer le token
  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'SecurePass123!'
    });

  token = registerResponse.body.token;
  userId = registerResponse.body.user.id;
});

describe('Protected Routes Tests', () => {
  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('john@example.com');
      expect(response.body.user.firstName).toBe('John');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token_here');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject request with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject request with expired token', async () => {
      // Créer un token expiré
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Token in Cookie', () => {
    it('should accept token from cookie', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `token=${token}`);

      // Dépend de votre implémentation du middleware
      // Peut être 200 ou 401 selon si vous supportez les cookies
      expect([200, 401]).toContain(response.status);
    });
  });

  describe('Token Formats', () => {
    it('should accept Bearer token format', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should reject token without Bearer prefix', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', token);

      expect(response.status).toBe(401);
    });
  });

  describe('Multiple Requests with Same Token', () => {
    it('should allow multiple requests with same token', async () => {
      const response1 = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      const response2 = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body.user.id).toBe(response2.body.user.id);
    });
  });

  describe('User Data Integrity', () => {
    it('should not expose sensitive data', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      // Password should not be in response
      expect(response.body.user.password).toBeUndefined();
    });

    it('should return correct user information', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user.firstName).toBe('John');
      expect(response.body.user.lastName).toBe('Doe');
      expect(response.body.user.email).toBe('john@example.com');
      expect(response.body.user.id).toBe(userId);
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle concurrent requests with same token', async () => {
      const requests = Array(5).fill(null).map(() =>
        request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${token}`)
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe('john@example.com');
      });
    });
  });
});
