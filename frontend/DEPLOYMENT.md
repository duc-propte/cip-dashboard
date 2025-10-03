# Frontend Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Method 1: Using Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Click "Add New" → "Project"

2. **Import Repository**
   - Connect your GitHub repository
   - Select `cip-dashboard`

3. **Configure Project**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend` ⚠️ IMPORTANT!
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

6. **Get Your URL**
   - Copy the deployment URL (e.g., `https://cip-dashboard.vercel.app`)

---

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? cip-dashboard
# - Directory? ./
# - Override settings? No

# Production deploy
vercel --prod
```

---

## Deploy to Netlify

### Step 1: Create netlify.toml

Already created in `frontend/netlify.toml`

### Step 2: Deploy

**Option A: Via Dashboard**
1. Go to https://netlify.com
2. "Add new site" → "Import existing project"
3. Connect GitHub repository
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/.next`

**Option B: Via CLI**
```bash
npm i -g netlify-cli
cd frontend
netlify init
netlify deploy --prod
```

---

## Deploy to Railway

```bash
cd frontend
railway init
railway up
```

---

## Environment Variables

After deployment, add these environment variables:

### Required:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Optional:
```bash
NODE_ENV=production
```

---

## Post-Deployment Steps

### 1. Update Backend CORS

Update your backend `.env`:
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

Redeploy backend after this change.

### 2. Update Salesforce Connected App

1. Go to Salesforce → Setup → App Manager
2. Edit your Connected App
3. Update Callback URL:
   ```
   https://your-frontend-url.vercel.app/auth/callback
   ```

### 3. Update Backend Environment Variable

Update backend:
```
SALESFORCE_REDIRECT_URI=https://your-frontend-url.vercel.app/auth/callback
```

### 4. Test the Flow

1. Visit `https://your-frontend-url.vercel.app`
2. Click "Connect to Salesforce"
3. Complete OAuth flow
4. View opportunities

---

## Troubleshooting

### Error: "Failed to fetch"

**Issue:** Frontend can't connect to backend

**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check backend is running: `curl https://your-backend-url.com/health`
3. Verify CORS is configured in backend

### Error: Build fails

**Issue:** Build command can't find files

**Solution:**
- Make sure "Root Directory" is set to `frontend` in Vercel
- Check that all dependencies are in `frontend/package.json`

### Error: redirect_uri_mismatch

**Issue:** OAuth callback URL doesn't match

**Solution:**
1. Update Salesforce Connected App callback URL
2. Update backend `SALESFORCE_REDIRECT_URI`
3. Ensure URLs match exactly (no trailing slashes)

---

## Performance Optimization

### Enable Edge Functions (Vercel)

Vercel automatically uses edge functions for optimal performance.

### Custom Domain

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update backend and Salesforce with new domain

---

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard → Your project → Analytics

### Error Tracking

Consider adding:
- Sentry
- LogRocket
- Datadog RUM

---

## Cost

- **Vercel:** Free for hobby projects, $20/month for Pro
- **Netlify:** Free for personal projects, $19/month for Pro
- **Railway:** Free tier available, pay-as-you-go

---

## Quick Reference

### Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed
- [ ] `NEXT_PUBLIC_API_URL` set in frontend
- [ ] `FRONTEND_URL` set in backend
- [ ] Salesforce Connected App callback updated
- [ ] Backend `SALESFORCE_REDIRECT_URI` updated
- [ ] Test OAuth flow
- [ ] Test opportunity fetching

### URLs to Update

After deployment, update these:

**Backend .env:**
```
SALESFORCE_REDIRECT_URI=https://frontend-url.com/auth/callback
FRONTEND_URL=https://frontend-url.com
```

**Frontend env:**
```
NEXT_PUBLIC_API_URL=https://backend-url.com
```

**Salesforce Connected App:**
- Callback URL: `https://frontend-url.com/auth/callback`


