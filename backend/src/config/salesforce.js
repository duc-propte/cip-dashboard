import dotenv from 'dotenv';

dotenv.config();

export const salesforceConfig = {
  clientId: process.env.SALESFORCE_CLIENT_ID,
  clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
  redirectUri: process.env.SALESFORCE_REDIRECT_URI,
  loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
};

// Debug log on startup
console.log('🔧 Salesforce Config Loaded:');
console.log('  - Client ID:', salesforceConfig.clientId ? '✅ Set' : '❌ Missing');
console.log('  - Client Secret:', salesforceConfig.clientSecret ? '✅ Set' : '❌ Missing');
console.log('  - Redirect URI:', salesforceConfig.redirectUri || '❌ Missing');
console.log('  - Login URL:', salesforceConfig.loginUrl);

export const serverConfig = {
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};


