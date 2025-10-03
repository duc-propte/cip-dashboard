# 🚀 Backend Quick Deploy (5 Minutes)

## Fastest Way: Railway

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Deploy
```bash
cd backend
railway login
railway init
railway up
```

### 3. Add Environment Variables

Go to https://railway.app → Your Project → Variables

Add these:
```
SALESFORCE_CLIENT_ID=your_consumer_key
SALESFORCE_CLIENT_SECRET=your_consumer_secret  
SALESFORCE_REDIRECT_URI=https://your-frontend.com/auth/callback
SALESFORCE_LOGIN_URL=https://login.salesforce.com
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com
```

### 4. Get Your Backend URL
```bash
railway domain
```

Copy the URL (e.g., `https://cip-backend-production.up.railway.app`)

### 5. Update Frontend

In `frontend/src/lib/salesforceApi.ts`:
```typescript
const API_BASE_URL = 'https://your-backend-url.railway.app';
```

### 6. Test
```bash
curl https://your-backend-url.railway.app/health
```

Should return: `{"status":"OK",...}`

---

## Alternative: Render (Free Tier)

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy backend"
git push
```

### 2. Deploy on Render

1. Go to https://render.com
2. New + → Web Service
3. Connect GitHub repo
4. Configure:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`

5. Add environment variables (same as above)

6. Click "Create Web Service"

Done! Your URL: `https://cip-backend.onrender.com`

---

## What's Next?

1. ✅ Deploy frontend
2. ✅ Update Salesforce Connected App callback URL
3. ✅ Test OAuth flow

See full guide: `DEPLOYMENT.md`


