import salesforceService from '../services/salesforceService.js';

/**
 * Initiate OAuth flow - redirect to Salesforce login
 */
export const initiateAuth = (req, res) => {
  try {
    const authUrl = salesforceService.getAuthorizationUrl();
    console.log('🔐 Generated OAuth URL:', authUrl);
    console.log('📍 Redirect URI being used:', process.env.SALESFORCE_REDIRECT_URI);
    res.json({ authUrl });
  } catch (error) {
    console.error('Error initiating auth:', error);
    res.status(500).json({ error: 'Failed to initiate authentication' });
  }
};

/**
 * OAuth callback handler
 */
export const handleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const authData = await salesforceService.authenticate(code);
    
    // In production, you'd want to store tokens securely (e.g., in session, JWT, or database)
    // For now, returning to client to store
    res.json({
      success: true,
      data: authData,
    });
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get current user information
 */
export const getUserInfo = async (req, res) => {
  const { accessToken, instanceUrl } = req.body;

  if (!accessToken || !instanceUrl) {
    return res.status(400).json({ error: 'Access token and instance URL are required' });
  }

  try {
    const userInfo = await salesforceService.getUserInfo(accessToken, instanceUrl);
    res.json({ success: true, data: userInfo });
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req, res) => {
  const { refreshToken, instanceUrl } = req.body;

  if (!refreshToken || !instanceUrl) {
    return res.status(400).json({ error: 'Refresh token and instance URL are required' });
  }

  try {
    const newTokens = await salesforceService.refreshAccessToken(refreshToken, instanceUrl);
    res.json({ success: true, data: newTokens });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ error: 'Failed to refresh token. Please re-authenticate.' });
  }
};


