# 🔧 Fix: OAuth Scope Error (invalid_scope)

## The Problem
Error: `invalid_scope - the requested scope is not allowed`

This means your Salesforce Connected App doesn't have the required OAuth scopes enabled.

## ✅ Solution

### Step 1: Update Salesforce Connected App Scopes

1. **Go to Salesforce Setup**
   - Login to your Salesforce org
   - Click gear icon → Setup

2. **Navigate to App Manager**
   - Quick Find → "App Manager"
   - Find your Connected App
   - Click **▼** dropdown → **Edit**

3. **Update OAuth Settings**
   
   Scroll to **"Selected OAuth Scopes"** and make sure these are selected:

   **Required Scopes (move from Available to Selected):**
   - ✅ **Access and manage your data (api)**
   - ✅ **Perform requests at any time (refresh_token, offline_access)**
   - ✅ **Full access (full)**
   - ✅ **Access unique user identifiers (openid)**

   **Optional but Recommended:**
   - ✅ **Access basic information (id, profile, email, address, phone)**

4. **Verify Callback URL**
   
   Make sure the Callback URL is still:
   ```
   http://localhost:3000/auth/callback
   ```

5. **Save**
   - Click **Save**
   - Wait a few seconds for changes to propagate

---

### Step 2: Restart Backend Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

---

### Step 3: Clear Browser Cache & Retry

1. **Clear Salesforce session:**
   - Go to Salesforce and logout
   - Or use an incognito/private window

2. **Try connecting again:**
   - Go to http://localhost:3000
   - Click "Connect to Salesforce"
   - Login and authorize

---

## Alternative: Use Minimal Scopes

If you still have issues, you can try with minimal scopes. Edit the backend code:

**File:** `backend/src/services/salesforceService.js`

**Find this line (around line 21):**
```javascript
scope: 'full refresh_token offline_access',
```

**Option 1: Full access (recommended)**
```javascript
scope: 'full refresh_token offline_access',
```

**Option 2: API access only**
```javascript
scope: 'api refresh_token offline_access',
```

**Option 3: Minimal (if other options fail)**
```javascript
scope: 'api',
```

Then restart the backend server.

---

## Salesforce Connected App Settings Checklist

In your Salesforce Connected App, verify:

- [x] **Enable OAuth Settings** - Checked
- [x] **Callback URL** - `http://localhost:3000/auth/callback`
- [x] **Selected OAuth Scopes:**
  - [x] Full access (full) OR Access and manage your data (api)
  - [x] Perform requests at any time (refresh_token, offline_access)
  - [x] Access unique user identifiers (openid)
- [x] **Refresh Token Policy** - Set to "Refresh token is valid until revoked"

---

## Still Having Issues?

### Check if you're using a Sandbox or Production org:

**For Sandbox:**
```env
SALESFORCE_LOGIN_URL=https://test.salesforce.com
```

**For Production/Developer Edition:**
```env
SALESFORCE_LOGIN_URL=https://login.salesforce.com
```

### Check your URL
The URL you shared shows: `orgfarm-1a3cb52c74-dev-ed.develop.my.salesforce.com`

This looks like a **Developer Edition** org. Make sure your `.env` uses:
```env
SALESFORCE_LOGIN_URL=https://login.salesforce.com
```

---

## Quick Test After Changes

1. Restart backend: `npm run dev` in backend folder
2. Check logs for config output
3. Open incognito window
4. Go to http://localhost:3000
5. Click "Connect to Salesforce"

You should now be able to authorize successfully! ✨

