require('dotenv').config(); // Load environment variables
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRoutes = require('../routes/userRoutes');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

jest.mock('../models/User');

describe('User Routes', () => {
  let token;

  beforeAll(() => {
    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'testsecret';
    }
    token = jwt.sign({ id: 'testUserId' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/login', () => {
    it('should return a token for valid credentials', async () => {
      const mockUser = { _id: 'testUserId', email: 'test@example.com', password: await bcrypt.hash('password', 10) };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Données invalides');
    });
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null); // Mock no existing user
      User.prototype.save = jest.fn().mockResolvedValue({ email: 'test@example.com' }); // Mock save method

      const response = await request(app)
        .post('/api/users/register')
        .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('saved');
    });

    it('should return 401 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .post('/api/users/register')
        .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('already sign up');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      User.find.mockResolvedValue([{ email: 'test@example.com' }]);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ email: 'test@example.com' }]);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID', async () => {
      User.findById.mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .get('/api/users/testUserId')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
    });

    it('should return 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/users/testUserId')
        .set('Authorization', token);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Utilisateur non trouvé');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user by ID', async () => {
      User.findByIdAndUpdate.mockResolvedValue({ email: 'updated@example.com' });

      const response = await request(app)
        .put('/api/users/testUserId')
        .set('Authorization', token)
        .send({ email: 'updated@example.com', password: 'newpassword' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Utilisateur mis à jour');
    });

    it('should return 404 if user not found', async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/users/testUserId')
        .set('Authorization', token)
        .send({ email: 'updated@example.com', password: 'newpassword' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Utilisateur non trouvé');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user by ID', async () => {
      User.findByIdAndDelete.mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .delete('/api/users/testUserId')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Utilisateur supprimé');
    });

    it('should return 404 if user not found', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/users/testUserId')
        .set('Authorization', token);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Utilisateur non trouvé');
    });
  });
});
