import express from 'express';
import {
  initiateAuth,
  handleCallback,
  getUserInfo,
  refreshToken,
} from '../controllers/authController.js';

const router = express.Router();

// Initiate OAuth flow
router.get('/login', initiateAuth);

// OAuth callback
router.get('/callback', handleCallback);

// Get user info
router.post('/user', getUserInfo);

// Refresh token
router.post('/refresh', refreshToken);

export default router;


