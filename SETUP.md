# CIP Dashboard - Complete Setup Guide

## Quick Start Checklist

- [ ] Set up Salesforce Connected App
- [ ] Configure backend `.env` file
- [ ] Start backend server (port 3001)
- [ ] Start frontend dev server (port 3000)
- [ ] Test OAuth connection

## 1. Salesforce Connected App Setup

### Create Connected App in Salesforce

1. Login to Salesforce → Setup (gear icon)
2. Quick Find → "App Manager"
3. Click "New Connected App"

### Configuration Details

```
Connected App Name: CIP Dashboard
API Name: CIP_Dashboard
Contact Email: your@email.com

✅ Enable OAuth Settings
Callback URL: http://localhost:3000/auth/callback

OAuth Scopes:
  ✅ Access and manage your data (api)
  ✅ Perform requests on your behalf at any time (refresh_token, offline_access)
```

4. Save and click "Manage Consumer Details"
5. **Copy Consumer Key and Consumer Secret** - you'll need these!

## 2. Backend Setup

### Create `.env` file

```bash
cd backend
cp env.example .env
```

### Edit `.env` with your credentials

```env
SALESFORCE_CLIENT_ID=your_consumer_key_here
SALESFORCE_CLIENT_SECRET=your_consumer_secret_here
SALESFORCE_REDIRECT_URI=http://localhost:3000/auth/callback
SALESFORCE_LOGIN_URL=https://login.salesforce.com

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Note:** For Sandbox, use `https://test.salesforce.com` for SALESFORCE_LOGIN_URL

### Start Backend Server

```bash
cd backend
npm install  # if not already done
npm run dev
```

**Expected Output:**
```
╔════════════════════════════════════════════╗
║   CIP Dashboard Backend Server Running    ║
╠════════════════════════════════════════════╣
║   Port: 3001                              ║
╚════════════════════════════════════════════╝
```

## 3. Frontend Setup

### Start Frontend (in a new terminal)

```bash
# From project root
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
```

## 4. Test the Integration

1. Open browser to `http://localhost:3000`
2. Click "Connect to Salesforce" button
3. Dialog will appear, click "Continue to Salesforce"
4. Login to Salesforce (if not already logged in)
5. Authorize the app
6. You'll be redirected back with success message
7. Dashboard will show "Connected" status

## Common Issues & Solutions

### ❌ Error: "Failed to fetch"

**Problem:** Backend server not running

**Solution:**
```bash
cd backend
npm run dev
```

---

### ❌ Error: "redirect_uri_mismatch"

**Problem:** Callback URL mismatch

**Solution:** Verify these match exactly:
- Salesforce Connected App: `http://localhost:3000/auth/callback`
- `.env` SALESFORCE_REDIRECT_URI: `http://localhost:3000/auth/callback`

---

### ❌ Error: "invalid_client_id" or "invalid_client"

**Problem:** Wrong credentials in `.env`

**Solution:**
1. Go to Salesforce → Setup → App Manager
2. Find your app → View → Manage Consumer Details
3. Copy Consumer Key to SALESFORCE_CLIENT_ID
4. Copy Consumer Secret to SALESFORCE_CLIENT_SECRET
5. Restart backend server

---

### ❌ CORS Error

**Problem:** CORS not configured properly

**Solution:** Check FRONTEND_URL in `.env` matches your frontend URL

---

## Project Structure

```
cip-dashboard/
├── backend/                # Node.js Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (Salesforce)
│   │   ├── middleware/    # Express middleware
│   │   └── server.js      # Main server file
│   ├── .env               # Environment variables (create this!)
│   ├── env.example        # Environment template
│   └── package.json
│
├── src/                   # Next.js frontend
│   ├── app/
│   │   ├── auth/callback/ # OAuth callback page
│   │   ├── layout.tsx
│   │   ├── page.tsx       # Homepage
│   │   └── globals.css
│   └── components/
│       └── SalesforceIntegration.tsx
│
└── package.json
```

## Available API Endpoints

### Backend (http://localhost:3001)

- `GET /health` - Health check
- `GET /api/auth/login` - Get OAuth URL
- `GET /api/auth/callback` - OAuth callback
- `POST /api/auth/user` - Get user info
- `POST /api/opportunities` - Get opportunities

## Next Steps

After successful connection:

1. ✅ Connection is established
2. 🔄 Implement opportunity fetching
3. 📊 Create dashboard views
4. 🎨 Add data visualizations
5. 🔐 Implement token refresh

## Need Help?

- Backend logs: Check terminal running `npm run dev` in backend folder
- Frontend logs: Check browser console (F12)
- Network requests: Check browser Network tab (F12)

## Security Reminders

- ⚠️ Never commit `.env` files
- 🔒 Keep Consumer Secret private
- 🚫 Don't share credentials
- ✅ Use `.gitignore` for sensitive files

