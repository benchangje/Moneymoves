# Firebase Authentication - Redirect Flow Setup

## Important: Authorized Redirect URIs

Since we're using redirect-based authentication (more reliable than popups), you need to configure your authorized redirect URIs in Firebase.

### Steps to Configure:

1. **Go to Firebase Console** → Select your project → **Authentication** → **Settings**

2. **Look for "Authorized domains"** section and verify:
   - `localhost` ✓ (should be added by default)
   - `http://localhost:5173` (add if not present)

3. **For your development domain:**
   - If running on a different port, add that port
   - Example: `http://localhost:5174`

4. **For production:**
   - Add your actual domain when deploying
   - Example: `https://yourdomain.com`

### To Add Custom Redirect URIs:

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Scroll down to **Web SDK configuration**
4. Make sure your local development URL is listed

### Common Issues:

**Issue: "Safari can't find the server"**
- Make sure `http://localhost:5173` is in the **Authorized domains** list
- Check that your Firebase project is correctly initialized
- Try clearing browser cache and cookies

**Issue: Sign-in button stops working after first attempt**
- Check the browser console (F12) for error messages
- The redirect should work the first time, then return you to the app
- If using redirect flow, the page will reload when you return from Google

### Testing:

1. Click the "Sign In" button
2. You'll be redirected to Google login
3. After signing in with your Google account, you'll be redirected back to your app
4. The navbar should now display your email and a "Logout" button

### Troubleshooting:

If it's still not working:
1. Open **Developer Tools** (F12 in Safari: Develop → Show JavaScript Console)
2. Look for error messages
3. Common errors:
   - `Error: Missing or invalid origin` → Add `http://localhost:5173` to authorized domains
   - `Error: User cancelled the popup` → This was from popup mode, should be fixed with redirect
   - `Error: Network error` → Check your Firebase credentials in `.env.local`

### Verifying Your .env.local:

Make sure these values are exactly as shown in your Firebase Console:

```
VITE_FIREBASE_API_KEY=AIzaSyC9ju...
VITE_FIREBASE_AUTH_DOMAIN=rentla-35b52.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rentla-35b52
VITE_FIREBASE_STORAGE_BUCKET=rentla-35b52.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=641268980881
VITE_FIREBASE_APP_ID=1:641268980881:web:6ec9746e6a286b8858f330
```
