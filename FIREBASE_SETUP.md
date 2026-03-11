# Firebase Authentication Setup Guide

## Prerequisites
- A Google account
- Admin access to your MoneyMoves project

## Steps to Set Up Firebase

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "MoneyMoves")
4. Follow the setup wizard and click "Create project"

### 2. Register Your Web App
1. In the Firebase Console, click the web icon (`</>`)
2. Enter your app name (e.g., "MoneyMoves Web")
3. Check "Also set up Firebase Hosting for this app" (optional)
4. Click "Register app"

### 3. Copy Your Firebase Config
Firebase will show you a code snippet with your configuration. It will look like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### 4. Configure Environment Variables
1. In the root of your project, edit `.env.local`
2. Replace the placeholder values with your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

### 5. Enable Google Sign-In
1. In the Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle "Enable" to ON
4. Select your support email
5. Click **Save**

### 6. Add Authorized Redirect URIs
1. Still in Google Sign-In settings, expand **Web SDK configuration**
2. Add your development URL if needed (should be automatic)
3. For production, you'll need to add your deployed domain

## Testing

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:5173/login`
3. Click "Sign in with Google"
4. Sign in with your Google account
5. You should be redirected to the home page

## Troubleshooting

### "The origin is not authorized to make this request"
- Make sure your development URL (http://localhost:5173) is added to Firebase's authorized domains
- Check in Firebase Console: Authentication → Settings → Authorized domains

### "Invalid API Key"
- Verify your `.env.local` file has the correct values
- Make sure you haven't exposed your API key in version control
- Add `.env.local` to `.gitignore` if it's not already there

### User Not Persisting on Page Reload
- This is normal! Firebase's `onAuthStateChanged` takes a moment to initialize
- The loading spinner should briefly show while Firebase verifies the user

## Security Notes

- ⚠️ **NEVER commit `.env.local` to git** - it contains sensitive credentials
- Make sure `.env.local` is in your `.gitignore`
- When deploying, use your hosting platform's environment variable settings
- Use Firebase Security Rules to protect your data (we'll set this up for Google Sheets integration)

## Next Steps

Once authentication is working:
1. Save user information from Google sign-in to your Google Sheets backend
2. Implement user-specific data queries based on the authenticated user's email
3. Add profile page to display/edit user information
