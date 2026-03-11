import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check if user has a profile document in Firestore
    const checkUserHasProfile = async (firebaseUser) => {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userDocRef);
        return docSnap.exists();
      } catch (err) {
        console.error('Error checking user profile:', err);
        return false; // Assume no profile on error → show setup
      }
    };

    // Safety timeout: ensure app loads even if Firebase auth hangs
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth initialization timed out, forcing load...');
        setLoading(false);
      }
    }, 5000);

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        console.log('Auth state changed:', currentUser?.email || 'No user');

        if (currentUser) {
          // Check profile BEFORE updating any state, so React can batch
          // all state changes into a single render
          const hasProfile = await checkUserHasProfile(currentUser);
          if (!isMounted) return;

          console.log('Profile check result — hasProfile:', hasProfile);
          setUser(currentUser);
          setNeedsProfileSetup(!hasProfile);
        } else {
          if (!isMounted) return;
          setUser(null);
          setNeedsProfileSetup(false);
        }

        clearTimeout(safetyTimeout);
        setLoading(false);
      },
      (authError) => {
        console.error('Auth state change error:', authError);
        if (isMounted) {
          setError(authError.message);
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  // Called by ProfileSetup after profile is created
  const completeProfileSetup = () => {
    setNeedsProfileSetup(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, needsProfileSetup, completeProfileSetup }}>
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
