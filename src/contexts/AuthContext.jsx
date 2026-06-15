import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, hasFirebaseConfig } from '../firebase';
import { browserLocalPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = null;
    let initialNullTimer = null;
    let hasResolvedInitialAuth = false;

    if (!hasFirebaseConfig || !auth || !db) {
      if (!isMounted) return undefined;
      setUser(null);
      setNeedsProfileSetup(false);
      setError(null);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const clearInitialNullTimer = () => {
      if (initialNullTimer) {
        clearTimeout(initialNullTimer);
        initialNullTimer = null;
      }
    };

    // Check if user has a profile document in Firestore
    const checkUserHasProfile = async (firebaseUser) => {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userDocRef);
        return docSnap.exists();
      } catch (err) {
        console.error('Error checking user profile:', err);
        return false;
      }
    };

    const finishAuthState = (firebaseUser, hasProfile) => {
      if (!isMounted) return;
      setUser(firebaseUser);
      setNeedsProfileSetup(Boolean(firebaseUser && !hasProfile));
      setLoading(false);
      hasResolvedInitialAuth = true;
      clearInitialNullTimer();
    };

    const handleAuthState = async (currentUser) => {
      console.log('Auth state changed:', currentUser?.email || 'No user');

      if (!currentUser) {
        if (!hasResolvedInitialAuth) {
          clearInitialNullTimer();
          initialNullTimer = setTimeout(() => {
            if (!isMounted) return;
            setUser(null);
            setNeedsProfileSetup(false);
            setLoading(false);
            hasResolvedInitialAuth = true;
          }, 800);
          return;
        }

        if (!isMounted) return;
        setUser(null);
        setNeedsProfileSetup(false);
        setLoading(false);
        return;
      }

      try {
        const hasProfile = await checkUserHasProfile(currentUser);
        if (!isMounted) return;

        console.log('Profile check result — hasProfile:', hasProfile);
        finishAuthState(currentUser, hasProfile);
      } catch (err) {
        console.error('Error during auth initialization:', err);
        if (!isMounted) return;
        finishAuthState(currentUser, false);
      }
    };

    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (persistError) {
        console.warn('Auth persistence setup warning:', persistError);
      }

      unsubscribe = onAuthStateChanged(auth, handleAuthState, (authError) => {
        console.error('Auth state change error:', authError);
        if (isMounted) {
          setError(authError.message);
          clearInitialNullTimer();
          setLoading(false);
        }
      });
    };

    initAuth();

    return () => {
      isMounted = false;
      clearInitialNullTimer();
      if (unsubscribe) {
        unsubscribe();
      }
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
