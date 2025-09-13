# 🛠 Supabase Setup Guide

## The Issue
If you're seeing "Connection Error" or only 1 person in your Live Vortex, it's because your Supabase environment variables are not configured.

## Quick Fix

### 1. Create Environment File
Copy the example environment file to create your local configuration:
```bash
cp .env.example .env.local
```

### 2. Get Your Supabase Credentials

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Create a new project** (if you haven't already)
3. **Go to Settings → API**
4. **Copy these values:**
   - Project URL (starts with `https://`)
   - Anon public key (the `anon` key, not the service role key)

### 3. Update .env.local
Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Restart Your Development Server
```bash
npm run dev
```

## How to Test Multi-User Presence

1. **Save the configuration above**
2. **Open the app in multiple browsers/devices:**
   - Chrome
   - Firefox
   - Safari
   - Mobile browser
   - Different computers
3. **Join with different names/emails in each browser**
4. **You should see all users appear in real-time!**

## Troubleshooting

### Still seeing only 1 person?
1. **Check the debug info** on the Live page - it should show:
   - `hasSupabaseUrl: true`
   - `hasSupabaseKey: true`
   - `connectionError: null`

2. **Check browser console** for any errors
3. **Try a different browser or incognito mode**
4. **Make sure you're using different email addresses** in each session

### Connection Issues?
- Verify your Supabase project is active
- Check that the URL and key are copied correctly (no extra spaces)
- Ensure your `.env.local` file is in the root directory

## What This Enables
- ✅ Real-time presence tracking
- ✅ Multiple users joining simultaneously  
- ✅ Live updates when people join/leave
- ✅ Works across different browsers and devices
