import { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../hooks/useReviews';

export default function ReviewForm({ listing, telehandle }) {
    const { user } = useAuth();
    const { profile } = useUserProfile(user);
    const { createReview } = useReviews();
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const myHandle = profile?.tele_handle?.toLowerCase().trim();
    const renterHandle = listing?.renterTelegram?.toLowerCase().trim();

    const canReview = Boolean(
        user && 
        listing?.id && 
        listing?.ownerUid && 
        user.uid !== listing.ownerUid && 
        myHandle &&
        renterHandle &&
        myHandle === renterHandle
    );

    if (!canReview) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canReview) {
            setMessage("You are unable to leave a review.");
        return;
        }

    try {
        setSaving(true);
        setMessage('');

    await createReview({
        listingId: listing.id,
        receiverId: listing.ownerUid,
        reviewerId: user.uid,
        reviewerName: user.displayName || user.email || 'Anonymous',
        rating,
        comment,
    });

        setRating(0);
        setComment('');
        setMessage('Review posted successfully.');
        setIsOpen(false);
        } catch (err) {
        setMessage(err.message || 'Failed to post review.');
        } finally {
        setSaving(false);
        }
    };

    return (
        <div className="mt-4 mb-3 border-t border-gray-200 pt-3" onClick={(e) => e.stopPropagation()}>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="text-md font-medium text-blue-600 hover:text-blue-700"
            >
                {isOpen ? 'Hide review form' : 'Leave a review'}
            </button>

            {isOpen && (
                <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                    onClick={() => setRating(value)}
                    className="p-0.5"
                    aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                >
                    <Star className={`w-4 h-4 ${value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
                ))}
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                placeholder="Share your experience..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {message && <p className="text-sm text-gray-700">{message}</p>}

            <button
                type="submit"
                disabled={saving || !canReview || rating === 0 || !comment.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
            >
                {saving ? 'Posting...' : 'Submit review'}
            </button>

            {!canReview && (
                <p className="text-xs text-gray-500">Only signed-in users can review other users.</p>
            )}
            </form>
        )}
        </div>
    );
}
