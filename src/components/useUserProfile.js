import { useState, useCallback, useEffect } from 'react';
import { db, hasFirebaseConfig } from './firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const useUserProfile = (user) => {
   	const [profile, setProfile] = useState(null);
	  const [loading, setLoading] = useState(!!user);
  	const [error, setError] = useState(null);

 	// Get user profile from Firestore
  	const getProfile = useCallback(async () => {
		if (!user) return;

		if (!hasFirebaseConfig || !db) {
			setProfile(null);
			setError(null);
			return;
		}
		
		try {
			setLoading(true);
			const userDocRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(userDocRef);
			
			if (docSnap.exists()) {
				setProfile(docSnap.data());
			} else {
				setProfile(null);
			}
		} catch (err) {
			console.error('Error fetching profile:', err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [user]);

    // Create user profile on first login
  	const createProfile = useCallback(async (profileData) => {
    	if (!user) return;

	    if (!hasFirebaseConfig || !db) {
			throw new Error('Firebase is not configured. Add a .env.local file before creating profiles.');
		}
    
		try {
			setLoading(true);
			const userDocRef = doc(db, 'users', user.uid);
		
		const newProfile = {
			...profileData,
			uid: user.uid,
			email: user.email,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		};
      
		await setDoc(userDocRef, newProfile, { merge: true });
			setProfile(newProfile);
			return newProfile;
		} catch (err) {
			console.error('Error creating profile:', err);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
    }, [user]);

  	// Update user profile
    const updateProfile = useCallback(async (updates) => {
    	if (!user) return;

	    if (!hasFirebaseConfig || !db) {
			throw new Error('Firebase is not configured. Add a .env.local file before updating profiles.');
		}
    
    	try {
			setLoading(true);
			const userDocRef = doc(db, 'users', user.uid);
      
		const updateData = {
			...updates,
			updatedAt: serverTimestamp(),
		};
      
		await updateDoc(userDocRef, updateData);
			setProfile(prev => ({ ...prev, ...updateData }));
			return { ...profile, ...updateData };
		} catch (err) {
			console.error('Error updating profile:', err);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
  	}, [user, profile]);

  	// Load profile on user change
	useEffect(() => {
		if (user) {
			getProfile();
		} else {
			setProfile(null);
			setLoading(false);
		}
	}, [user, getProfile]);

	return {
		profile,
		loading,
		error,
		createProfile,
		updateProfile,
		getProfile,
	};
};
