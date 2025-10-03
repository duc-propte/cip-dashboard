# 🚀 Quick Start: Embed in Salesforce (5 Minutes)

## What You'll Get
When users click on an Opportunity in Salesforce, they'll see your custom dashboard UI embedded directly in the page!

---

## Step 1: Deploy Your App (Choose One)

### Option A: Test Locally with ngrok (Fastest for Testing)

```bash
# Terminal 1: Start your Next.js app
npm run dev

# Terminal 2: Start ngrok
npx ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### Option B: Deploy to Production

```bash
# Using Vercel (recommended)
npm install -g vercel
vercel deploy --prod
```

Or deploy to your preferred hosting platform.

---

## Step 2: Create Visualforce Page in Salesforce

1. **Login to Salesforce**
   - Click gear icon → Setup

2. **Go to Visualforce Pages**
   - Quick Find box → Type "Visualforce Pages"
   - Click "Visualforce Pages"

3. **Click "New"**

4. **Fill in Details:**
   - **Label:** `Opportunity Profile Dashboard`
   - **Name:** `OpportunityProfileDashboard`
   - ✅ Check "Available for Lightning Experience"
   - ✅ Check "Available for Salesforce Mobile App"

5. **Paste This Code:**

```xml
<apex:page standardController="Opportunity" showHeader="false" sidebar="false">
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        .embed-container { width: 100%; height: 900px; border: none; }
    </style>
    
    <iframe 
        src="https://YOUR-URL-HERE.com/opportunity-profile/{!Opportunity.Id}?embedded=true"
        class="embed-container"
        frameborder="0"
        scrolling="auto">
    </iframe>
</apex:page>
```

**⚠️ IMPORTANT:** Replace `YOUR-URL-HERE.com` with your actual URL!

Examples:
- ngrok: `https://abc123.ngrok-free.app`
- Vercel: `https://your-app.vercel.app`
- Custom: `https://your-domain.com`

6. **Click "Save"**

---

## Step 3: Add to Opportunity Page Layout

1. **Go to Object Manager**
   - Setup → Object Manager
   - Search for "Opportunity"
   - Click on Opportunity

2. **Edit Page Layout**
   - Click "Lightning Record Pages" (for Lightning) or "Page Layouts" (for Classic)
   
   **For Lightning Experience:**
   - Click "New"
   - Select "Record Page"
   - Label: "Opportunity with Custom Dashboard"
   - Object: Opportunity
   - Click "Next" → Choose template → "Finish"

3. **Add Visualforce Component**
   - In the Lightning App Builder:
   - Find "Visualforce" in the components list (left side)
   - Drag it onto the page (suggested: bottom of the page or new tab)
   - In properties, select your Visualforce page: `OpportunityProfileDashboard`
   - Set Height: 900 pixels

4. **Activate the Page**
   - Click "Activation"
   - "Assign as Org Default" or assign to specific profiles
   - Click "Save"

**For Classic:**
- Page Layouts → Opportunity Layout → Edit
- Add new Section called "Custom Dashboard"
- Drag "Visualforce Pages" component
- Select your page
- Set height to 900px
- Save

---

## Step 4: Test It!

1. Go to any Opportunity in Salesforce
2. Scroll down to see your embedded dashboard
3. If you see authentication needed, authenticate once
4. Your custom UI should now display!

---

## Troubleshooting

### 🔴 "This page can't be displayed in a frame"

**Fix:** Make sure you're using HTTPS (not HTTP)
- ngrok automatically provides HTTPS
- Vercel/Netlify provide HTTPS by default

### 🔴 Blank iframe

**Fix 1:** Check browser console (F12) for errors

**Fix 2:** Verify your URL in the Visualforce page is correct

**Fix 3:** Clear Salesforce cache:
- Setup → Session Settings → Clear cache

### 🔴 ngrok URL changes every time

**Solution:** 
- Use `ngrok http 3000 --domain=your-static-domain` (requires paid plan)
- Or update Visualforce page each time you restart ngrok
- Or deploy to production

### 🔴 Authentication issues

The embedded page uses localStorage which is domain-specific:
- User needs to authenticate once in the embedded view
- Tokens persist for future visits
- Consider implementing Salesforce SSO for seamless experience

---

## URLs to Remember

### Your App URLs:
- **Local:** `http://localhost:3000`
- **ngrok:** `https://[your-id].ngrok-free.app`
- **Production:** `https://your-domain.com`

### Embed URL Format:
```
https://YOUR-DOMAIN/opportunity-profile/{!Opportunity.Id}?embedded=true
```

The `?embedded=true` parameter hides navigation elements for a cleaner look.

---

## Next Steps

- ✅ Test with different opportunities
- ✅ Customize the dashboard UI
- ✅ Add more metrics/visualizations  
- ✅ Set up production deployment
- ✅ Configure proper authentication/SSO

---

## Need Help?

Check the full guide: `salesforce/DEPLOYMENT_GUIDE.md`

**Common Issues:**
- HTTPS required for iframe embedding
- CORS must allow Salesforce domains
- Tokens are stored per domain (localStorage)

