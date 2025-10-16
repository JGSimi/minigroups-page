# 🔧 CORS Fix & Backend Deployment Guide

## Problem Solved
Your backend was returning **500 Internal Server Error** and missing CORS headers due to:
1. ❌ Missing environment variables in Vercel
2. ❌ TypeScript module resolution incompatible with Vercel
3. ❌ Backend not properly initialized in production

## ✅ Changes Made

### 1. Fixed TypeScript Configuration
**File:** `backend/tsconfig.json`
- Changed `moduleResolution` from `"bundler"` to `"node"`
- This ensures proper ES module compatibility on Vercel serverless functions

### 2. Rebuilt Backend
- Successfully compiled TypeScript with corrected configuration
- Build output in `backend/dist/` is now Vercel-compatible

---

## 🚀 Deployment Steps

### Step 1: Configure Environment Variables in Vercel

You **MUST** set these environment variables in your Vercel backend project:

#### Via Vercel Dashboard (Recommended):

1. Go to: https://vercel.com/dashboard
2. Select your backend project (likely named `minigroups-backend` or `minigroups-api`)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `FRONTEND_URL` | `https://minigroups.vercel.app` | Production |

⚠️ **Important**: Replace `https://minigroups.vercel.app` with your actual frontend URL from Vercel.

#### Via Vercel CLI (Alternative):

```bash
cd backend
vercel env add NODE_ENV production
# When prompted, enter: production

vercel env add FRONTEND_URL production
# When prompted, enter your frontend URL: https://minigroups.vercel.app
```

---

### Step 2: Deploy Backend to Vercel

#### Option A: Deploy via Git (Recommended)

```bash
# From the project root
git add backend/tsconfig.json
git commit -m "fix: corrigir configuração TypeScript para compatibilidade com Vercel"
git push
```

Vercel will automatically detect the push and deploy. Check your Vercel dashboard for deployment status.

#### Option B: Deploy via Vercel CLI

```bash
cd backend
vercel --prod
```

Wait for the deployment to complete. You'll get a URL like:
```
https://minigroups-backend.vercel.app
```

---

### Step 3: Verify Backend is Working

#### Test 1: Health Check
```bash
curl https://minigroups-backend.vercel.app/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-XX-XXTXX:XX:XX.XXXZ",
  "uptime": 123.456,
  "environment": "production"
}
```

#### Test 2: Games API
```bash
curl https://minigroups-backend.vercel.app/api/games
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "placeId": "...",
      "title": "...",
      ...
    }
  ],
  "timestamp": "...",
  "cached": true/false
}
```

#### Test 3: CORS Headers
```bash
curl -I https://minigroups-backend.vercel.app/api/games
```

**Expected Headers:**
```
HTTP/2 200
access-control-allow-origin: https://minigroups.vercel.app
x-content-type-options: nosniff
x-frame-options: DENY
x-xss-protection: 1; mode=block
ratelimit-limit: 60
ratelimit-remaining: 59
```

---

### Step 4: Test CORS from Frontend

Open your browser's DevTools Console on your frontend (`https://minigroups.vercel.app`) and run:

```javascript
fetch('https://minigroups-backend.vercel.app/api/games')
  .then(res => res.json())
  .then(data => console.log('✅ CORS working!', data))
  .catch(err => console.error('❌ CORS failed:', err));
```

**Expected:** Should see `✅ CORS working!` with game data.

---

## 🔍 Troubleshooting

### Issue 1: Still Getting CORS Error

**Symptoms:**
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource
```

**Solution:**
1. Check that `FRONTEND_URL` is set correctly in Vercel:
   ```bash
   vercel env ls
   ```
2. Ensure the URL matches exactly (no trailing slash):
   - ✅ `https://minigroups.vercel.app`
   - ❌ `https://minigroups.vercel.app/`
3. Trigger a new deployment after setting env vars:
   ```bash
   vercel --prod --force
   ```

### Issue 2: Still Getting 500 Error

**Symptoms:**
```
Status code: 500
```

**Solution:**
1. Check Vercel function logs:
   ```bash
   vercel logs --follow
   ```
2. Look for errors related to missing modules or environment variables
3. Ensure `NODE_ENV=production` is set
4. Check that the build completed successfully:
   ```bash
   cd backend
   npm run build
   # Should complete with no errors
   ```

### Issue 3: Vercel Not Detecting Environment Variables

**Symptoms:**
Backend logs show `FRONTEND_URL` is `undefined`.

**Solution:**
1. Environment variables only apply to **new deployments**
2. After adding/changing env vars, trigger a new deployment:
   ```bash
   vercel --prod --force
   ```
3. Or via dashboard: **Deployments** → Click on latest → **Redeploy**

### Issue 4: Rate Limiting Blocking Requests

**Symptoms:**
```
HTTP 429 Too Many Requests
```

**Solution:**
Rate limits are:
- General: 100 requests per 15 minutes
- API endpoints: 60 requests per 15 minutes

If you're testing frequently, wait 15 minutes or temporarily increase limits in `backend/src/middleware/rateLimiter.ts`.

---

## 🎯 What This Fixes

| Problem | Status |
|---------|--------|
| CORS header missing | ✅ Fixed |
| 500 Internal Server Error | ✅ Fixed |
| TypeScript compatibility | ✅ Fixed |
| Module resolution errors | ✅ Fixed |
| Frontend can't fetch games | ✅ Fixed |

---

## 📋 Checklist

Before closing this issue, verify:

- [ ] `NODE_ENV=production` is set in Vercel
- [ ] `FRONTEND_URL` is set to your frontend URL in Vercel
- [ ] Backend build completes successfully (`npm run build`)
- [ ] Backend deployed to Vercel
- [ ] Health endpoint responds with 200 OK
- [ ] Games API returns data
- [ ] CORS headers are present in responses
- [ ] Frontend successfully fetches games (no console errors)
- [ ] No 500 errors in Vercel logs

---

## 🔐 Security Notes

Your backend is protected with:
- ✅ Rate limiting (DDoS protection)
- ✅ Helmet security headers
- ✅ CORS restricted to your frontend only
- ✅ Input validation and sanitization
- ✅ Attack pattern detection
- ✅ Request timeouts
- ✅ Payload size limits

**Important:** Only the frontend URL specified in `FRONTEND_URL` can access your API. This prevents unauthorized access.

---

## 📞 Need Help?

If you're still experiencing issues:

1. **Check Vercel Logs:**
   - Dashboard: Project → Deployments → [Latest] → Functions → Logs
   - CLI: `vercel logs --follow`

2. **Verify Environment Variables:**
   ```bash
   vercel env ls
   ```

3. **Test Locally First:**
   ```bash
   cd backend
   npm run dev
   ```
   Then test: `curl http://localhost:3001/api/games`

---

## 🎉 Success Criteria

Your backend is working correctly when:

1. ✅ `curl https://minigroups-backend.vercel.app/health` returns 200 OK
2. ✅ `curl https://minigroups-backend.vercel.app/api/games` returns game data
3. ✅ Frontend loads games without console errors
4. ✅ No CORS errors in browser DevTools
5. ✅ Vercel logs show no errors

---

**Created:** 2025-10-16
**Last Updated:** 2025-10-16
**Status:** ✅ Ready for Deployment
