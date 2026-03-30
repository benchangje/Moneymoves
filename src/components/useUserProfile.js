import { useState, useCallback, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const useUserProfile = (user) => {
   	const [profile, setProfile] = useState(null);
  	const [loading, setLoading] = useState(false);
  	const [error, setError] = useState(null);

 	 // Get user profile from Firestore
  	const getProfile = useCallback(async () => {
		if (!user) return;
		
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
    
		try {
			setLoading(true);
			const userDocRef = doc(db, 'users', user.uid);
		
		const newProfile = {
			uid: user.uid,
			email: user.email,
			displayName: profileData?.displayName || user.displayName || '',
			photoURL: user.photoURL || profileData?.photoURL || '',
			bio: profileData?.bio || '',
			phone: profileData?.phone || '',
			location: profileData?.location || '',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			...profileData,
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
