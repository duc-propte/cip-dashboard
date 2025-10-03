# CIP Dashboard Backend - Salesforce OAuth Setup Guide

## Prerequisites

Before you can use the Salesforce integration, you need to set up a Connected App in Salesforce.

## Step 1: Create a Salesforce Connected App

1. **Log into Salesforce**
   - Go to https://login.salesforce.com (or your Salesforce instance)

2. **Navigate to Setup**
   - Click the gear icon in the top right
   - Select "Setup"

3. **Create a Connected App**
   - In Quick Find, search for "App Manager"
   - Click "New Connected App"

4. **Configure the Connected App**
   
   **Basic Information:**
   - Connected App Name: `CIP Dashboard` (or your preferred name)
   - API Name: Will auto-populate
   - Contact Email: Your email address

   **API (Enable OAuth Settings):**
   - ✅ Enable OAuth Settings
   - Callback URL: `http://localhost:3000/auth/callback`
   - Selected OAuth Scopes:
     - ✅ Access and manage your data (api)
     - ✅ Perform requests on your behalf at any time (refresh_token, offline_access)
     - ✅ Access your basic information (id, profile, email, address, phone)

   **Save the app**

5. **Get Your Credentials**
   - After saving, click "Manage Consumer Details"
   - You'll see your **Consumer Key** (Client ID)
   - You'll see your **Consumer Secret** (Client Secret)
   - **IMPORTANT:** Save these credentials securely!

## Step 2: Configure Environment Variables

1. **Create `.env` file in the backend directory:**

```bash
cd backend
cp env.example .env
```

2. **Edit the `.env` file with your credentials:**

```env
# Salesforce OAuth Configuration
SALESFORCE_CLIENT_ID=your_consumer_key_from_salesforce
SALESFORCE_CLIENT_SECRET=your_consumer_secret_from_salesforce
SALESFORCE_REDIRECT_URI=http://localhost:3000/auth/callback
SALESFORCE_LOGIN_URL=https://login.salesforce.com

# For Sandbox, use: https://test.salesforce.com
# For Production, use: https://login.salesforce.com

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Step 3: Install Dependencies & Start Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Start the server
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║   CIP Dashboard Backend Server Running    ║
╠════════════════════════════════════════════╣
║   Port: 3001                              ║
║   Environment: development                ║
║   Frontend URL: http://localhost:3000     ║
╚════════════════════════════════════════════╝
```

## Step 4: Test the Connection

1. Open your browser to `http://localhost:3000`
2. Click "Connect to Salesforce"
3. You'll be redirected to Salesforce login
4. Log in and authorize the app
5. You'll be redirected back to the callback page

## API Endpoints

### Authentication

- `GET /api/auth/login` - Get OAuth authorization URL
- `GET /api/auth/callback?code=xxx` - Handle OAuth callback
- `POST /api/auth/user` - Get current user info
- `POST /api/auth/refresh` - Refresh access token

### Opportunities

- `POST /api/opportunities` - Get all opportunities
- `POST /api/opportunities/:id` - Get opportunity by ID

## Troubleshooting

### Error: "Failed to fetch"

**Cause:** Backend server is not running

**Solution:** Start the backend server with `npm run dev` in the backend directory

---

### Error: "redirect_uri_mismatch"

**Cause:** Callback URL mismatch between Salesforce app and your configuration

**Solution:** 
1. Check Salesforce Connected App callback URL
2. Check SALESFORCE_REDIRECT_URI in .env file
3. Both must be exactly: `http://localhost:3000/auth/callback`

---

### Error: "invalid_client_id"

**Cause:** Incorrect Consumer Key in environment variables

**Solution:**
1. Go to Salesforce Setup → App Manager
2. Find your Connected App
3. Click "View" → "Manage Consumer Details"
4. Copy the correct Consumer Key to SALESFORCE_CLIENT_ID in .env

---

### Error: "CORS error"

**Cause:** Frontend and backend running on different origins

**Solution:** 
1. Ensure FRONTEND_URL in .env matches your frontend URL
2. Restart the backend server after changing .env

---

### Error: "Authentication failed"

**Cause:** Various possible issues with OAuth flow

**Solution:**
1. Clear browser cookies/cache
2. Check all environment variables are set correctly
3. Verify Salesforce user has proper permissions
4. Check if you're using correct login URL (production vs sandbox)

## Security Notes

- **Never commit `.env` file to version control**
- Store credentials securely
- Use environment variables for all sensitive data
- In production, use HTTPS for all URLs
- Consider implementing token encryption/storage

## Production Deployment

When deploying to production:

1. Update callback URLs in Salesforce Connected App
2. Update SALESFORCE_REDIRECT_URI to production URL
3. Update FRONTEND_URL to production URL
4. Use HTTPS for all URLs
5. Set NODE_ENV=production
6. Implement secure token storage (database, encrypted cookies, etc.)
7. Add rate limiting and security middleware
8. Configure proper CORS settings

## Support

For issues with:
- **Salesforce Setup:** Check Salesforce documentation or Trailhead
- **Backend API:** Check server logs and console output
- **OAuth Flow:** Review Salesforce OAuth 2.0 documentation

