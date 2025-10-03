# 🔧 Quick Fix: redirect_uri_mismatch Error

## The Problem
Your Salesforce Connected App callback URL doesn't match the one being sent by the backend.

## ✅ Solution (3 Steps)

### Step 1: Update Salesforce Connected App

1. Go to **Salesforce Setup** (gear icon)
2. Search for **"App Manager"** in Quick Find
3. Find your Connected App → Click **▼** → **Edit**
4. Scroll to **"Callback URL"** and make sure it's **EXACTLY**:
   ```
   http://localhost:3000/auth/callback
   ```
5. Click **Save**

**IMPORTANT:** The URL must be port **3000** (frontend), not 3001 (backend)!

---

### Step 2: Create/Update Backend `.env` File

Create or edit the file: `backend/.env`

**Copy this template and fill in your credentials:**

```env
# Salesforce OAuth Configuration
SALESFORCE_CLIENT_ID=YOUR_CONSUMER_KEY_HERE
SALESFORCE_CLIENT_SECRET=YOUR_CONSUMER_SECRET_HERE
SALESFORCE_REDIRECT_URI=http://localhost:3000/auth/callback
SALESFORCE_LOGIN_URL=https://login.salesforce.com

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Where to get credentials:**
- Go to Salesforce → Setup → App Manager
- Your app → Click **▼** → **View**
- Click **"Manage Consumer Details"**
- Copy **Consumer Key** → Paste as `SALESFORCE_CLIENT_ID`
- Copy **Consumer Secret** → Paste as `SALESFORCE_CLIENT_SECRET`

**For Sandbox:** Change `SALESFORCE_LOGIN_URL=https://test.salesforce.com`

---

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

Wait until you see:
```
╔════════════════════════════════════════════╗
║   CIP Dashboard Backend Server Running    ║
╠════════════════════════════════════════════╣
║   Port: 3001                              ║
╚════════════════════════════════════════════╝
```

---

## ✅ Test the Connection

1. Open browser: `http://localhost:3000`
2. Click **"Connect to Salesforce"**
3. Click **"Continue to Salesforce"**
4. Login and authorize
5. Should redirect back successfully! ✨

---

## 🔍 Still Having Issues?

### Check These Common Mistakes:

#### ❌ Wrong Port in Callback URL
- ✅ Should be: `http://localhost:3000/auth/callback` (port 3000)
- ❌ NOT: `http://localhost:3001/auth/callback` (port 3001)

#### ❌ Typo in URL
- Check for extra spaces, http vs https, etc.

#### ❌ Missing Credentials
- Make sure you copied Consumer Key and Secret correctly
- No extra spaces or quotes

#### ❌ Backend Not Running
- Terminal should show "CIP Dashboard Backend Server Running"
- Check port 3001 is not being used by another app

#### ❌ Wrong Login URL
- Production: `https://login.salesforce.com`
- Sandbox: `https://test.salesforce.com`

---

## 🆘 Need Help?

**Check backend logs:**
```bash
# Backend terminal should show any errors
```

**Check browser console:**
- Press F12 → Console tab
- Look for any red errors

**Verify URLs match:**
1. Salesforce Connected App callback URL
2. Backend .env SALESFORCE_REDIRECT_URI
3. Both must be: `http://localhost:3000/auth/callback`

