import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Check for redirect result first (handles sign-in redirects)
        try {
          const result = await getRedirectResult(auth);
          if (isMounted && result?.user) {
            console.log('Redirect result user found:', result.user.email);
            setUser(result.user);
            await createUserProfileIfNew(result.user);
          }
        } catch (err) {
          if (err.code !== 'auth/no-redirect-result') {
            console.error('Redirect result error:', err);
            if (isMounted) {
              setError(err.message);
            }
          }
        }
      } catch (err) {
        console.error('Error checking redirect result:', err);
      }
    };

    // Initialize redirect result check
    initializeAuth();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        console.log('Auth state changed:', currentUser?.email || 'No user');
        if (isMounted) {
          setUser(currentUser);
          if (currentUser) {
            await createUserProfileIfNew(currentUser);
          }
          setLoading(false);
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Create profile for user if it doesn't exist
  const createUserProfileIfNew = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        // New user - mark that they need to complete setup
        console.log('New user detected, needs profile setup:', user.uid);
        setNeedsProfileSetup(true);
        return false; // Profile doesn't exist
      } else {
        // User has profile
        console.log('Existing user, profile found:', user.uid);
        setNeedsProfileSetup(false);
        return true; // Profile exists
      }
    } catch (err) {
      console.error('Error checking user profile:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, needsProfileSetup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
