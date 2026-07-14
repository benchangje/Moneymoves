import { useEffect, useState, useCallback } from 'react';
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase';

export const useListings = ({ ownerUid = null, renterTelegram = null, publishedOnly = false, skip = false } = {}) => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const buildQuery = useCallback(() => {
        if (!hasFirebaseConfig || !db) {
            return null;
        }
        if (skip) {
            return null;
        }
        const listingsRef = collection(db, "listings");
        const constraints = [];
        if (ownerUid) {
            constraints.push(where("ownerUid", "==", ownerUid));
        }
        if (renterTelegram != null) {
            constraints.push(where("renterTelegram", "==", renterTelegram.toLowerCase()));
        }
        if (publishedOnly) {
            constraints.push(where("status", "==", "published"));
        }
        return query(listingsRef, ...constraints);
    }, [ownerUid, renterTelegram, publishedOnly]);

    useEffect(() => {
        const q = buildQuery();

        if (!q) {
            setListings([]);
            setError(null);
            setLoading(false);
            return undefined;
        }

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
        const items = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || null,
            };
        });

            const filteredItems = (publishedOnly
                ? items.filter((listing) => listing.status === 'published')
                : items
            ).sort((a, b) => {
                const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return timeB - timeA;
            });

        setListings(filteredItems);
        setLoading(false);
        },
        (err) => {
            console.error('Error loading listings:', err);
            setError(err.message);
            setLoading(false);
        }
    );

        return () => unsubscribe();
    }, [buildQuery, publishedOnly]);

    return { listings, loading, error };
};

export const createListing = async (listingData) => {
    if (!hasFirebaseConfig || !db) {
        throw new Error('Firebase is not configured. Add a .env.local file before creating listings.');
    }

    const docRef = await addDoc(collection(db, 'listings'), {
        ...listingData,
        status: 'published',
        createdAt: serverTimestamp(),
    });

    return docRef;
};

export const updateListing = async (listingId, updates) => {
    if (!hasFirebaseConfig || !db) {
        throw new Error('Firebase is not configured. Add a .env.local file before updating listings.');
    }

    const listingRef = doc(db, 'listings', listingId);
    await updateDoc(listingRef, updates);
};