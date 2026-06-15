import { useEffect, useState, useCallback } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../firebase';

export const useListings = ({ ownerUid = null, publishedOnly = false } = {}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildQuery = useCallback(() => {
    if (!hasFirebaseConfig || !db) {
      return null;
    }

    const listingsRef = collection(db, 'listings');

    if (ownerUid && publishedOnly) {
      return query(
        listingsRef,
        where('ownerUid', '==', ownerUid),
        where('status', '==', 'published')
      );
    }

    if (ownerUid) {
      return query(listingsRef, where('ownerUid', '==', ownerUid));
    }

    if (publishedOnly) {
      return query(listingsRef, where('status', '==', 'published'));
    }

    return query(listingsRef);
  }, [ownerUid, publishedOnly]);

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
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || null,
        }));

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
