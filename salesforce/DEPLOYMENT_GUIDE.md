# Embedding Opportunity Profile in Salesforce

## Overview
This guide shows you how to embed your custom Next.js opportunity profile page directly into Salesforce Opportunity records.

## Prerequisites
- Salesforce admin access
- Your Next.js app deployed to a public URL (or use ngrok for testing)
- CORS properly configured on your Next.js app

---

## Method 1: Visualforce Page (Recommended)

### Step 1: Deploy Visualforce Page to Salesforce

#### Option A: Using Salesforce Setup (No Code Tools Required)

1. **Login to Salesforce**
   - Go to Setup (gear icon)

2. **Navigate to Visualforce Pages**
   - Quick Find → Search "Visualforce Pages"
   - Click "Visualforce Pages"

3. **Create New Page**
   - Click "New"
   - Label: `Opportunity Profile Embed`
   - Name: `OpportunityProfileEmbed`
   - Available for Lightning Experience: ✅ Check
   - Available for Salesforce Mobile: ✅ Check

4. **Paste the Code**

```xml
<apex:page standardController="Opportunity" showHeader="false" sidebar="false">
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .embed-container {
            width: 100%;
            height: 100vh;
            border: none;
        }
    </style>
    
    <iframe 
        src="https://YOUR-APP-URL.com/opportunity-profile/{!Opportunity.Id}?embedded=true"
        class="embed-container"
        id="opportunityFrame"
        frameborder="0"
        scrolling="auto"
    ></iframe>
</apex:page>
```

**Important:** Replace `YOUR-APP-URL.com` with your actual deployed URL!

5. **Click Save**

#### Option B: Using VS Code with Salesforce Extension

1. Install Salesforce Extension Pack in VS Code
2. Copy files from `salesforce/` folder to your SFDX project
3. Deploy using: `sfdx force:source:deploy -p force-app/main/default/pages/`

---

### Step 2: Add to Opportunity Page Layout

1. **Go to Opportunity Object**
   - Setup → Object Manager → Opportunity

2. **Edit Page Layout**
   - Page Layouts → Edit your layout (e.g., "Opportunity Layout")

3. **Add Visualforce Section**
   - Drag "Section" from the palette
   - Name: "Custom Profile Dashboard"
   - Layout: 1-Column
   - Click OK

4. **Add Visualforce Page**
   - Drag "Visualforce Pages" component
   - Select: `OpportunityProfileEmbed`
   - Set height: 800px (or adjust as needed)
   - Width: 100%

5. **Save the Layout**

---

## Method 2: Lightning Web Component (Advanced)

For a more native Lightning Experience, create an LWC:

```javascript
// opportunityProfileEmbed.js
import { LightningElement, api } from 'lwc';

export default class OpportunityProfileEmbed extends LightningElement {
    @api recordId;
    
    get iframeSrc() {
        return `https://YOUR-APP-URL.com/opportunity-profile/${this.recordId}?embedded=true`;
    }
}
```

```html
<!-- opportunityProfileEmbed.html -->
<template>
    <div class="embed-container">
        <iframe
            src={iframeSrc}
            frameborder="0"
            scrolling="auto"
            style="width: 100%; height: 800px; border: none;"
        ></iframe>
    </div>
</template>
```

---

## Method 3: Custom Button (Quick Access)

1. **Create Custom Button**
   - Setup → Object Manager → Opportunity
   - Buttons, Links, and Actions → New Button or Link

2. **Button Configuration**
   - Label: `View Custom Profile`
   - Name: `View_Custom_Profile`
   - Display Type: Detail Page Button
   - Behavior: Display in new window
   - Content Source: URL

3. **Button URL**
```
https://YOUR-APP-URL.com/opportunity-profile/{!Opportunity.Id}
```

4. **Add to Page Layout**
   - Edit Page Layout
   - Buttons section → Add your custom button

---

## Step 3: Configure Your Next.js App for Embedding

### Update Next.js Configuration

Add CORS and iframe support to your Next.js app:

**File: `next.config.js`**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/opportunity-profile/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://your-salesforce-instance.salesforce.com',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.salesforce.com https://*.force.com",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Detect Embedded Mode

Update your opportunity profile page to handle embedded mode:

**Detect if page is embedded:**
```typescript
const isEmbedded = searchParams.get('embedded') === 'true';
```

**Hide navigation when embedded:**
```typescript
{!isEmbedded && (
  <Button onClick={() => router.push('/')}>
    Back to Dashboard
  </Button>
)}
```

---

## Step 4: Testing with ngrok (Local Development)

For testing before deployment:

1. **Install ngrok**
```bash
npm install -g ngrok
```

2. **Start your Next.js app**
```bash
npm run dev
```

3. **Start ngrok**
```bash
ngrok http 3000
```

4. **Use ngrok URL**
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
   - Use this in your Visualforce page
   - Update in Salesforce: `https://abc123.ngrok.io/opportunity-profile/{!Opportunity.Id}`

---

## Step 5: Production Deployment

### Deploy Next.js App

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel deploy --prod
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Option 3: Custom Server**
- Build: `npm run build`
- Start: `npm start`
- Use reverse proxy (nginx/Apache)

### Update Salesforce Configuration

Once deployed, update your Visualforce page with the production URL.

---

## Security Considerations

### 1. CORS Configuration

Ensure your Next.js app allows Salesforce domains:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  if (origin?.includes('salesforce.com') || origin?.includes('force.com')) {
    return NextResponse.next({
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  
  return NextResponse.next();
}
```

### 2. Authentication

Since the user is already authenticated in Salesforce, you can:

**Option A: Pass Salesforce Session ID (Advanced)**
- Requires Connected App setup
- Pass session ID via postMessage
- Validate on your backend

**Option B: Use Salesforce Auth (Current Setup)**
- Keep current OAuth flow
- User authenticates once in your app
- Tokens stored in localStorage persist

### 3. Content Security Policy

Add to your Next.js app:
```typescript
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'ALLOW-FROM https://your-org.salesforce.com'
  },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self' *.salesforce.com *.force.com"
  }
];
```

---

## Troubleshooting

### Issue: Blank iframe in Salesforce

**Solution:**
- Check browser console for errors
- Verify CORS settings
- Check X-Frame-Options header
- Ensure URL is HTTPS (Salesforce requires HTTPS)

### Issue: Authentication not working

**Solution:**
- Tokens are stored in localStorage (domain-specific)
- User needs to authenticate once in the embedded view
- Consider implementing SSO

### Issue: Iframe too small/large

**Solution:**
- Adjust height in Visualforce page layout
- Use responsive design in Next.js
- Consider using postMessage to send height updates

---

## Example: Full Integration

Here's the complete flow:

1. User clicks Opportunity in Salesforce
2. Opportunity page loads with custom Visualforce section
3. Iframe loads your Next.js app at `/opportunity-profile/[id]`
4. If not authenticated, show login prompt in iframe
5. Once authenticated, show opportunity details
6. Data fetched from Salesforce API via your backend

---

## Next Steps

- [ ] Deploy Next.js app to production
- [ ] Create and deploy Visualforce page
- [ ] Add to Opportunity page layout
- [ ] Test with real opportunity data
- [ ] Configure CORS properly
- [ ] Add authentication handling
- [ ] Customize UI for embedded mode

## Resources

- [Salesforce Visualforce Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/)
- [Lightning Web Components Guide](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

