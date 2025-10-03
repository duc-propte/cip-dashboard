# Backend Callback Authentication - Setup Guide

## ✅ What Changed

The authentication flow has been **refactored for security**:

### **Before (Frontend Callback)**
```
User → Salesforce → Frontend → Backend → Frontend (stores tokens in localStorage)
❌ Tokens exposed in browser
❌ Vulnerable to XSS attacks
```

### **After (Backend Callback)** ✨
```
User → Salesforce → Backend (stores tokens in session) → Frontend
✅ Tokens never leave the server
✅ Session cookies are HttpOnly
✅ Enterprise-grade security
```

---

## 🚀 Quick Setup

### **1. Install Dependencies**

```bash
cd backend
npm install
```

This installs the new `express-session` dependency.

### **2. Update Environment Variables**

#### **Local Development**

Edit `backend/.env`:

```env
# Salesforce OAuth Configuration
SALESFORCE_CLIENT_ID=your_consumer_key
SALESFORCE_CLIENT_SECRET=your_consumer_secret
SALESFORCE_REDIRECT_URI=http://localhost:3001/api/auth/callback  # ⚠️ CHANGED: Now points to BACKEND
SALESFORCE_LOGIN_URL=https://login.salesforce.com

# Server Configuration
PORT=3001
NODE_ENV=development

# Session Configuration (NEW)
SESSION_SECRET=your-super-secret-random-string-here  # Generate a secure random string

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000  # ⚠️ No trailing slash!
```

**Generate a secure session secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### **Production (Render)**

Update these environment variables on Render:

1. Go to https://render.com
2. Open your backend service
3. Go to **Environment** tab
4. Update/Add these variables:

```
SALESFORCE_REDIRECT_URI=https://cip-dashboard.onrender.com/api/auth/callback
SESSION_SECRET=<use the generated random string>
FRONTEND_URL=https://cip-dashboard-psi.vercel.app  (⚠️ NO trailing slash!)
NODE_ENV=production
```

### **3. Update Salesforce Connected App**

**Critical:** Salesforce needs to redirect to your **BACKEND** now, not frontend.

1. Go to **Salesforce Setup** → **App Manager**
2. Find your Connected App → **Edit**
3. Update **Callback URL** to:
   - **Local:** `http://localhost:3001/api/auth/callback`
   - **Production:** `https://cip-dashboard.onrender.com/api/auth/callback`
4. **Save**

⚠️ **Important:** For production, you may want to add BOTH URLs:
```
http://localhost:3001/api/auth/callback
https://cip-dashboard.onrender.com/api/auth/callback
```

### **4. Update Frontend Environment Variable**

Edit `frontend/.env.local`:

```env
# For local development
NEXT_PUBLIC_API_URL=http://localhost:3001

# For production (Vercel), set this in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://cip-dashboard.onrender.com
```

### **5. Start Servers**

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

---

## 🔐 Security Improvements

| Feature | Before | After |
|---------|--------|-------|
| **Token Storage** | localStorage (browser) | Server-side session |
| **Token Exposure** | Visible in DevTools | Never sent to browser |
| **XSS Protection** | ❌ Vulnerable | ✅ HttpOnly cookies |
| **Token Theft** | ❌ Possible | ✅ Not accessible to JS |
| **Session Management** | Manual | ✅ Automatic by backend |

---

## 📝 API Changes

### **Before (Frontend had to send tokens)**

```typescript
// ❌ Old way
const opportunities = await fetchOpportunities({
  accessToken: authData.accessToken,
  instanceUrl: authData.instanceUrl
});
```

### **After (Backend uses session)**

```typescript
// ✅ New way - much simpler!
const opportunities = await fetchOpportunities();
// Backend automatically uses tokens from session
```

---

## 🧪 Testing the Flow

### **1. Test Authentication**

1. Go to `http://localhost:3000`
2. Click "Connect to Salesforce"
3. You'll be redirected to: `Backend → Salesforce → Backend → Frontend`
4. After success, you'll be back on the homepage with `?auth=success` in URL

### **2. Check Session**

Open browser DevTools → Application → Cookies → `http://localhost:3000`

You should see a cookie named `connect.sid` (session ID). This is HttpOnly and Secure.

### **3. Test API Calls**

Try fetching opportunities. The backend will automatically use the session to authenticate.

---

## 🛠 Troubleshooting

### **Error: "Route not found" on callback**

**Cause:** Salesforce is redirecting to old frontend URL

**Fix:** Update `SALESFORCE_REDIRECT_URI` in your environment variables and Salesforce Connected App

### **Error: "Not authenticated"**

**Cause:** Session not being sent or CORS issue

**Fix:** 
1. Make sure `credentials: 'include'` is in all fetch calls
2. Ensure `FRONTEND_URL` has NO trailing slash
3. Check browser cookies are enabled

### **Error: "CORS policy"**

**Cause:** Frontend URL mismatch

**Fix:** 
1. Check `FRONTEND_URL` in backend matches your frontend origin EXACTLY
2. Remove any trailing slashes
3. Restart backend server after changing env vars

### **Session expires too quickly**

**Fix:** Increase session duration in `server.js`:
```javascript
cookie: {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}
```

---

## 📚 New Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/auth/login` | GET | Redirects to Salesforce OAuth |
| `GET /api/auth/callback` | GET | Salesforce redirects here (handles code exchange) |
| `GET /api/auth/status` | GET | Check if user is authenticated |
| `GET /api/auth/user` | GET | Get current user info |
| `POST /api/auth/logout` | POST | Destroy session and logout |
| `GET /api/opportunities` | GET | Get all opportunities (session-based) |
| `GET /api/opportunities/:id` | GET | Get single opportunity (session-based) |

All endpoints except `/login` and `/callback` require an active session.

---

## 🎉 Benefits

1. **More Secure:** Tokens never exposed to frontend
2. **Simpler Frontend:** No token management needed
3. **Better UX:** Session persists across page refreshes
4. **Enterprise Ready:** Follows OAuth2 best practices
5. **Token Refresh:** Backend can handle token refresh transparently

---

## 🔄 Migration Checklist

- [ ] Install `express-session` in backend
- [ ] Update backend environment variables
- [ ] Update Salesforce Connected App callback URL
- [ ] Update frontend environment variable
- [ ] Test authentication flow locally
- [ ] Deploy backend with new env vars
- [ ] Deploy frontend with new env vars
- [ ] Update production Salesforce Connected App
- [ ] Test production authentication flow

---

**Questions?** Check `backend/README.md` for more details.

