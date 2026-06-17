import { useState, useEffect, useCallback } from 'react';
import { db, hasFirebaseConfig } from './firebase';
import { addDoc, collection, onSnapshot, query, serverTimestamp, where, orderBy } from 'firebase/firestore';

export const useReviews = (reviewType = 'listing', targetId = null, enabled = true) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!enabled || !targetId || !hasFirebaseConfig || !db) {
        queueMicrotask(() => {
            setReviews([]);
            setLoading(false);
        });
        return;
    }

    try {
        const reviewsRef = collection(db, 'reviews');
        
        // Query reviews for listing or user profile
        const q = reviewType === 'listing'
            ? query(reviewsRef, where('listingId', '==', targetId), orderBy('createdAt', 'desc'))
            : query(reviewsRef, where('receiverId', '==', targetId), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
            const reviewsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || null,
            }));
                setReviews(reviewsData);
                setError(null);
                setLoading(false);
            },
            (err) => {
            console.error('Error loading reviews:', err);
            setError(err.message);
            setLoading(false);
            }
        );

        return () => unsubscribe();
        } catch (err) {
            console.error('Error setting up reviews listener:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [targetId, reviewType, enabled]);

    const createReview = useCallback(async (reviewData) => {
        if (!hasFirebaseConfig || !db) {
            throw new Error('Firebase is not configured. Add a .env.local file before creating reviews.');
        }

    const reviewerId = reviewData.reviewerId;
    const rating = Number(reviewData.rating);
    const comment = reviewData.comment?.trim() || '';

        if (!reviewerId) {
            throw new Error('You must be signed in to leave a review.');
        }

        if (!rating || rating < 1 || rating > 5) {
            throw new Error('Please choose a rating between 1 and 5.');
        }

        if (!comment) {
            throw new Error('Please add a comment to your review.');
        }

        return addDoc(collection(db, 'reviews'), {
            listingId: reviewData.listingId || null,
            receiverId: reviewData.receiverId || null,
            reviewerId,
            reviewerName: reviewData.reviewerName || 'Anonymous',
            rating,
            comment,
            createdAt: serverTimestamp(),
        });
    }, []);

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    const ratedStars = Math.round(averageRating);

    return {
        reviews,
        loading,
        error,
        averageRating,
        ratedStars,
        reviewCount: reviews.length,
        createReview,
    };
};
