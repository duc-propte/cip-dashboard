import express from 'express';
import {
  initiateAuth,
  handleCallback,
  checkAuth,
  getUserInfo,
  refreshToken,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

// Initiate OAuth flow - redirects to Salesforce
router.get('/login', initiateAuth);

// OAuth callback - Salesforce redirects here
router.get('/callback', handleCallback);

// Check authentication status
router.get('/status', checkAuth);

// Get user info (requires session)
router.get('/user', getUserInfo);

// Refresh token (requires session)
router.post('/refresh', refreshToken);

// Logout
router.post('/logout', logout);

export default router;


