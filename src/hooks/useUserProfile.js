import { useState, useCallback, useEffect } from 'react';
import { db, hasFirebaseConfig, storage } from '../hooks/firebase';
import { doc, setDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const DEFAULT_PROFILE_PICTURE = '/default-pfp.svg';
const DEFAULT_BANNER_PICTURE = '/rentlalogonew.jpg'

const uploadProfileAsset = async (userId, file, assetType) => {
    if (!file || !storage) return '';

    const assetRef = ref(storage, `profiles/${userId}/${assetType}-${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(assetRef, file);
    return getDownloadURL(snapshot.ref);
};

export const useUserProfile = (user) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  // Get user profile from Firestore with real-time listener
    const getProfile = useCallback(() => {
        if (!user) return () => {};

        if (!hasFirebaseConfig || !db) {
            setProfile(null);
            setError(null);
            setLoading(false);
            return () => {};
        }
    
    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(
        userDocRef,
        (docSnap) => {
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            } else {
                setProfile(null);
            }
            setError(null);
            setLoading(false);
      },
        (err) => {
            console.error('Error fetching profile:', err);
            setError(err.message);
            setLoading(false);
        }
    );

        return unsubscribe;
    }, [user]);

    // Create user profile on first login
    const createProfile = useCallback(async (profileData) => {
        if (!user) return;

    if (!hasFirebaseConfig || !db) {
        throw new Error('Firebase is not configured.');
    }
    
    try {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const uploadedPhotoURL = await uploadProfileAsset(user.uid, profileData?.photoFile, 'avatar');
        const uploadedBannerURL = await uploadProfileAsset(user.uid, profileData?.bannerFile, 'banner');
      
        const newProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || profileData?.displayName || '',
            photoURL: uploadedPhotoURL || user.photoURL || profileData?.photoURL || DEFAULT_PROFILE_PICTURE,
            bannerURL: uploadedBannerURL || profileData?.bannerURL || '',
            bio: profileData?.bio || '',
            location: profileData?.location || '',
            tele_handle: profileData?.tele_handle || '',
            profileCompleted: profileData?.profileCompleted || false,
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

    // Set up real-time listener on user change
    useEffect(() => {
        const unsubscribe = getProfile();
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [user, getProfile]);

    useEffect(() => {
        const ensureDefaultProfilePicture = async () => {
            if (!user || !profile || profile.photoURL) return;
            if (!hasFirebaseConfig || !db) return;

            try {
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, {
                photoURL: DEFAULT_PROFILE_PICTURE,
                updatedAt: serverTimestamp(),
                });
            } catch (err) {
                console.error('Error backfilling default profile picture:', err);
            }
        };

        ensureDefaultProfilePicture();
    }, [profile, user]);

    return {
        profile,
        loading,
        error,
        createProfile,
        updateProfile,
        getProfile,
    };
};
