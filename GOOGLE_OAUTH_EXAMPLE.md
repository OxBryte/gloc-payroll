# Google OAuth Implementation Guide

## Frontend Implementation

### 1. Add to `authApi.js`

```javascript
// Add this function to src/components/services/authApi.js

export async function googleAuth() {
  try {
    // Redirect to your backend's Google OAuth endpoint
    // Your backend will handle the OAuth flow
    window.location.href = `${apiURL}auth/google`;
  } catch (error) {
    console.error("Error initiating Google auth:", error);
    throw new Error("Failed to initiate Google authentication");
  }
}

export async function googleAuthCallback(code) {
  try {
    const { data } = await axios.post(`${apiURL}auth/google/callback`, { code });
    return data;
  } catch (error) {
    console.error("Error during Google auth callback:", error);
    throw new Error(
      error.response?.data?.message || "Google authentication failed"
    );
  }
}
```

### 2. Create Google Auth Hook

```javascript
// src/components/hooks/useGoogleAuth.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { googleAuth, googleAuthCallback } from "../services/authApi";

export const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: googleAuthFn, isPending } = useMutation({
    mutationKey: ["googleAuth"],
    mutationFn: async () => {
      return await googleAuth();
    },
    onError(error) {
      toast.error(error.message || "Google authentication failed");
    },
  });

  // Handle callback after Google redirects back
  const handleGoogleCallback = async (code) => {
    try {
      const data = await googleAuthCallback(code);
      
      toast.success("Successfully authenticated with Google!");

      // Set user data in global state
      queryClient.setQueryData(["user"], data.data.user);

      // Save token
      localStorage.setItem("token", data.data.token);
      document.cookie = `token=${data.data.token}; path=/; max-age=172800; Secure; SameSite=Strict;`;

      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google authentication failed");
      navigate("/login");
    }
  };

  return { googleAuthFn, handleGoogleCallback, isPending };
};
```

### 3. Add Google Button to Login Page

```jsx
// Add to src/pages/Login.jsx
import { useGoogleAuth } from "../components/hooks/useGoogleAuth";

// Inside the Login component:
const { googleAuthFn, isPending: isGoogleLoading } = useGoogleAuth();

// Add this button after the regular login button:
<div className="w-full flex gap-3 my-3 items-center justify-between">
  <hr className="border-gray-200 w-full" />
  <p className="text-sm text-gray-500">OR</p>
  <hr className="border-gray-200 w-full" />
</div>

<button
  type="button"
  onClick={() => googleAuthFn()}
  disabled={isGoogleLoading}
  className="w-full px-5 py-3 rounded-md flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 transition-colors"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  {isGoogleLoading ? "Connecting..." : "Continue with Google"}
</button>
```

### 4. Handle OAuth Callback Route

```jsx
// src/pages/GoogleCallback.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../components/hooks/useGoogleAuth";
import Spinner from "../components/ui/Spinner";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useGoogleAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google authentication was cancelled");
      navigate("/login");
      return;
    }

    if (code) {
      handleGoogleCallback(code);
    } else {
      navigate("/login");
    }
  }, [searchParams, handleGoogleCallback, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
      <p className="ml-4">Completing Google authentication...</p>
    </div>
  );
}
```

Add route in `App.jsx`:
```jsx
<Route path="/auth/google/callback" element={<GoogleCallback />} />
```

---

## Backend Implementation (Node.js/Express Example)

### 1. Install Dependencies

```bash
npm install passport passport-google-oauth20 express-session
```

### 2. Backend Route Example

```javascript
// backend/routes/auth.js
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

const router = express.Router();

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Check if user exists with this email
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            avatar: profile.photos[0].value,
            emailVerified: true, // Google emails are verified
          });
        }
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle Google callback
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      
      // Generate JWT token (same as your current login)
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '48h' }
      );
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

module.exports = router;
```

### 3. Environment Variables

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
```

### 4. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback` (or your backend URL)

---

## Alternative: Firebase Auth (Frontend-Only Solution)

If you want to avoid backend changes, Firebase Auth handles everything:

```bash
npm install firebase
```

```javascript
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

```javascript
// src/components/hooks/useFirebaseAuth.js
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

export const useFirebaseGoogleAuth = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Send Firebase token to your backend to create session
      const response = await axios.post(`${apiURL}auth/firebase`, {
        idToken: await user.getIdToken()
      });
      
      // Handle response like regular login
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return { signInWithGoogle };
};
```

---

## Recommendation

**For your current setup**, I recommend:
1. **Add Google OAuth to your existing backend** (Option 1)
   - Minimal changes
   - Works with your current JWT system
   - Full control

2. **Use Firebase Auth for Passkeys** (if you want passkeys)
   - Complex to implement securely yourself
   - Firebase handles all the WebAuthn complexity
   - Can integrate with your backend

Would you like me to implement the Google OAuth integration for your frontend?
