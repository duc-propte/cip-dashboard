import salesforceService from '../services/salesforceService.js';

/**
 * Initiate OAuth flow - redirect to Salesforce login
 */
export const initiateAuth = (req, res) => {
  try {
    const authUrl = salesforceService.getAuthorizationUrl();
    console.log('🔐 Generated OAuth URL:', authUrl);
    console.log('📍 Redirect URI being used:', process.env.SALESFORCE_REDIRECT_URI);
    
    // Redirect directly to Salesforce (not returning JSON)
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating auth:', error);
    res.status(500).send('Failed to initiate authentication');
  }
};

/**
 * OAuth callback handler - Salesforce redirects here
 */
export const handleCallback = async (req, res) => {
  const { code, error } = req.query;

  // Handle OAuth error
  if (error) {
    console.error('OAuth error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.status(400).send('Authorization code is required');
  }

  try {
    // Exchange code for tokens
    const authData = await salesforceService.authenticate(code);
    
    // Store tokens in session (SERVER-SIDE)
    req.session.salesforce = {
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      instanceUrl: authData.instanceUrl,
      userId: authData.userId,
      organizationId: authData.organizationId,
    };

    // Save session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).send('Failed to save session');
      }

      console.log('✅ Authentication successful! Tokens stored in session.');
      console.log('📍 Session ID:', req.sessionID);
      
      // Redirect to frontend success page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}?auth=success`);
    });
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Check authentication status
 */
export const checkAuth = (req, res) => {
  if (req.session && req.session.salesforce) {
    res.json({
      authenticated: true,
      userId: req.session.salesforce.userId,
      organizationId: req.session.salesforce.organizationId,
    });
  } else {
    res.json({ authenticated: false });
  }
};

/**
 * Get current user information (uses session)
 */
export const getUserInfo = async (req, res) => {
  // Get tokens from session
  if (!req.session || !req.session.salesforce) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { accessToken, instanceUrl } = req.session.salesforce;

  try {
    const userInfo = await salesforceService.getUserInfo(accessToken, instanceUrl);
    res.json({ success: true, data: userInfo });
  } catch (error) {
    console.error('Error getting user info:', error);
    
    // If token expired, try to refresh
    if (error.message.includes('INVALID_SESSION_ID') || error.message.includes('Session expired')) {
      return res.status(401).json({ error: 'Session expired', code: 'TOKEN_EXPIRED' });
    }
    
    res.status(500).json({ error: error.message });
  }
};

/**
 * Refresh access token (uses session)
 */
export const refreshToken = async (req, res) => {
  if (!req.session || !req.session.salesforce) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { refreshToken, instanceUrl } = req.session.salesforce;

  try {
    const newTokens = await salesforceService.refreshAccessToken(refreshToken, instanceUrl);
    
    // Update session with new tokens
    req.session.salesforce.accessToken = newTokens.accessToken;
    
    res.json({ success: true, message: 'Token refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    // Clear session on refresh failure
    req.session.destroy();
    
    res.status(401).json({ error: 'Failed to refresh token. Please re-authenticate.' });
  }
};

/**
 * Logout - destroy session
 */
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ success: true, message: 'Logged out successfully' });
  });
};


