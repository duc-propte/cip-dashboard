# Backend Deployment Guide

## 🚀 Quick Deploy Options

Choose your preferred platform:
- [Railway](#option-1-railway-easiest) - ⭐ Recommended (Free tier, easiest)
- [Render](#option-2-render) - Great free tier
- [Heroku](#option-3-heroku) - Classic choice
- [DigitalOcean](#option-4-digitalocean-app-platform) - $5/month
- [AWS/Azure/GCP](#option-5-aws-ec2-or-azure-vms) - Advanced

---

## Prerequisites

Before deploying, ensure you have:
- ✅ Backend code in `backend/` folder
- ✅ `.env` file configured (don't commit this!)
- ✅ Salesforce Connected App credentials
- ✅ Git repository (GitHub, GitLab, or Bitbucket)

---

## Option 1: Railway (Easiest) ⭐

**Pros:** Free tier, automatic HTTPS, easy setup, great for Node.js  
**Cons:** Free tier has usage limits

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

### Step 3: Initialize Project

```bash
cd backend
railway init
```

### Step 4: Add Environment Variables

```bash
# Add each variable
railway variables set SALESFORCE_CLIENT_ID="your_client_id"
railway variables set SALESFORCE_CLIENT_SECRET="your_secret"
railway variables set SALESFORCE_REDIRECT_URI="https://your-frontend-url.com/auth/callback"
railway variables set SALESFORCE_LOGIN_URL="https://login.salesforce.com"
railway variables set PORT="3001"
railway variables set NODE_ENV="production"
railway variables set FRONTEND_URL="https://your-frontend-url.com"
```

Or use the Railway dashboard:
- Go to https://railway.app
- Click your project → Variables
- Add all environment variables

### Step 5: Deploy

```bash
railway up
```

### Step 6: Get Your URL

```bash
railway domain
```

Your backend will be available at: `https://your-app.railway.app`

---

## Option 2: Render

**Pros:** Free tier, auto-deploys from GitHub, easy setup  
**Cons:** Cold starts on free tier

### Step 1: Push to GitHub

```bash
cd /path/to/cip-dashboard
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Account

Go to https://render.com and sign up

### Step 3: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `cip-dashboard-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 4: Add Environment Variables

In Render dashboard, add:
```
SALESFORCE_CLIENT_ID=your_client_id
SALESFORCE_CLIENT_SECRET=your_secret
SALESFORCE_REDIRECT_URI=https://your-frontend-url.com/auth/callback
SALESFORCE_LOGIN_URL=https://login.salesforce.com
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Step 5: Deploy

Click "Create Web Service" - Render will automatically deploy!

Your backend URL: `https://cip-dashboard-backend.onrender.com`

---

## Option 3: Heroku

**Pros:** Reliable, well-documented  
**Cons:** No free tier anymore ($5/month minimum)

### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login

```bash
heroku login
```

### Step 3: Create App

```bash
cd backend
heroku create cip-dashboard-backend
```

### Step 4: Set Environment Variables

```bash
heroku config:set SALESFORCE_CLIENT_ID="your_client_id"
heroku config:set SALESFORCE_CLIENT_SECRET="your_secret"
heroku config:set SALESFORCE_REDIRECT_URI="https://your-frontend-url.com/auth/callback"
heroku config:set SALESFORCE_LOGIN_URL="https://login.salesforce.com"
heroku config:set NODE_ENV="production"
heroku config:set FRONTEND_URL="https://your-frontend-url.com"
```

### Step 5: Create Procfile

Create `backend/Procfile`:
```
web: node src/server.js
```

### Step 6: Deploy

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

Your backend URL: `https://cip-dashboard-backend.herokuapp.com`

---

## Option 4: DigitalOcean App Platform

**Pros:** Good performance, $5/month  
**Cons:** Not free

### Step 1: Create DigitalOcean Account

Go to https://www.digitalocean.com

### Step 2: Create App

1. Apps → Create App
2. Connect GitHub repository
3. Select repository and branch
4. Configure:
   - **Source Directory:** `backend`
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`

### Step 3: Add Environment Variables

Add all your environment variables in the dashboard

### Step 4: Deploy

Click "Create Resources" - deploys automatically!

---

## Option 5: AWS EC2 (or Azure VMs)

**Pros:** Full control, scalable  
**Cons:** More complex, requires server management

### Quick Setup with PM2

1. **Launch EC2 Instance** (Ubuntu 22.04)

2. **SSH into server:**
```bash
ssh ubuntu@your-server-ip
```

3. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install PM2:**
```bash
sudo npm install -g pm2
```

5. **Clone repository:**
```bash
git clone https://github.com/your-username/cip-dashboard.git
cd cip-dashboard/backend
```

6. **Install dependencies:**
```bash
npm install
```

7. **Create `.env` file:**
```bash
nano .env
# Paste your environment variables
```

8. **Start with PM2:**
```bash
pm2 start src/server.js --name cip-backend
pm2 save
pm2 startup
```

9. **Setup Nginx reverse proxy:**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/cip-backend
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cip-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Post-Deployment Steps

### 1. Update Frontend URL

Update your frontend `salesforceApi.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.com';
```

### 2. Update Salesforce Connected App

1. Go to Salesforce → Setup → App Manager
2. Edit your Connected App
3. Update Callback URL to your production frontend URL:
   ```
   https://your-frontend-url.com/auth/callback
   ```

### 3. Update Backend Environment Variables

Make sure `SALESFORCE_REDIRECT_URI` matches your frontend:
```
SALESFORCE_REDIRECT_URI=https://your-frontend-url.com/auth/callback
```

### 4. Update CORS Settings

Your backend already handles CORS via `FRONTEND_URL` environment variable.

### 5. Test the Deployment

```bash
# Health check
curl https://your-backend-url.com/health

# Should return:
# {"status":"OK","timestamp":"...","uptime":...}
```

---

## Environment Variables Checklist

Make sure all these are set in your deployment platform:

```bash
✅ SALESFORCE_CLIENT_ID          # From Salesforce Connected App
✅ SALESFORCE_CLIENT_SECRET      # From Salesforce Connected App
✅ SALESFORCE_REDIRECT_URI       # Your frontend callback URL
✅ SALESFORCE_LOGIN_URL          # https://login.salesforce.com
✅ PORT                          # 3001 (or platform default)
✅ NODE_ENV                      # production
✅ FRONTEND_URL                  # Your frontend URL for CORS
```

---

## Monitoring & Logs

### Railway
```bash
railway logs
```

### Render
- Dashboard → Your Service → Logs

### Heroku
```bash
heroku logs --tail
```

### PM2 (Self-hosted)
```bash
pm2 logs cip-backend
pm2 monit
```

---

## Troubleshooting

### Issue: CORS errors after deployment

**Solution:** Make sure `FRONTEND_URL` environment variable matches your actual frontend URL (including https://)

### Issue: "Cannot connect to backend"

**Solutions:**
1. Check if backend is running: `curl https://your-backend-url.com/health`
2. Verify environment variables are set
3. Check logs for errors
4. Ensure port is correct (most platforms use PORT environment variable)

### Issue: OAuth redirect_uri_mismatch

**Solution:** Update both:
1. Salesforce Connected App callback URL
2. Backend `SALESFORCE_REDIRECT_URI` environment variable

### Issue: Cold starts (free tiers)

**Solutions:**
- Use Railway or upgrade to paid tier
- Implement health check pings
- Consider using Render's cron jobs feature

---

## Cost Comparison

| Platform | Free Tier | Paid Starting | Best For |
|----------|-----------|---------------|----------|
| Railway | ✅ 500 hrs/month | $5/month | Quick deploy |
| Render | ✅ Cold starts | $7/month | GitHub integration |
| Heroku | ❌ | $5/month | Enterprise |
| DigitalOcean | ❌ | $5/month | Performance |
| AWS/Azure | ❌ (Free trial) | $10+/month | Scale |

---

## Recommended Setup

**For Development/Testing:**
- Railway (free tier)

**For Production:**
- Render ($7/month) or DigitalOcean ($5/month)
- Setup monitoring
- Configure automatic backups
- Use environment-specific configs

---

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend (see frontend deployment guide)
3. ✅ Update Salesforce Connected App
4. ✅ Test OAuth flow end-to-end
5. ✅ Setup monitoring/alerts
6. ✅ Configure custom domain (optional)

---

## Security Checklist

- ✅ Never commit `.env` file
- ✅ Use HTTPS (most platforms provide this)
- ✅ Set `NODE_ENV=production`
- ✅ Keep dependencies updated
- ✅ Use environment variables for all secrets
- ✅ Enable rate limiting (add middleware if needed)
- ✅ Setup monitoring for errors

---

## Support

- **Railway:** https://railway.app/help
- **Render:** https://render.com/docs
- **Heroku:** https://devcenter.heroku.com
- **DigitalOcean:** https://docs.digitalocean.com

---

## Quick Reference

### Backend URL Format
```
https://your-backend-url.com/api/auth/login
https://your-backend-url.com/api/opportunities
```

### Environment Variable Template
Create `backend/.env.production`:
```env
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_REDIRECT_URI=https://your-frontend.com/auth/callback
SALESFORCE_LOGIN_URL=https://login.salesforce.com
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com
```


