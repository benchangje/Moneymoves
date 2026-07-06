import ImageDropzoneProfile from "./ImageDropzoneProfile";
import BannerDropzoneProfile from './BannerDropzoneProfile';
import { useRef, useState, useEffect } from 'react';
import { resizeImage } from './ImageDropzoneProfile';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useListings } from '../hooks/useListings';
import { useReviews } from '../hooks/useReviews';
import { Star } from 'lucide-react';
import ListingCard from './ListingCard';

const DEFAULT_PROFILE_PICTURE = '/default-pfp.svg';
const DEFAULT_BANNER_PICTURE = '/rentlalogonew.jpg'

export default function Profile() {
    const { user } = useAuth();
    const { profile, updateProfile } = useUserProfile(user);
    const { listings: userListings } = useListings({ ownerUid: user?.uid });
    const { reviews, loading: reviewsLoading, averageRating, ratedStars } = useReviews('user', user?.uid);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editPhotoURL, setEditPhotoURL] = useState('');
    const [editBannerURL, setEditBannerURL] = useState('');
    const [editPhotoPreview, setEditPhotoPreview] = useState('');
    const [editBannerPreview, setEditBannerPreview] = useState('');
    const [avatarError, setAvatarError] = useState(false);
    const photoInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Initialize form with profile data
    useEffect(() => {
        if (profile) {
            setEditName(profile.displayName || '');
            setEditBio(profile.bio || '');
            setEditLocation(profile.location || '');
            setEditPhotoPreview(profile.photoURL || '');
            setEditBannerPreview(profile.bannerURL || '');
            setAvatarError(false);
        }
    }, [profile]);

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageDataUrl = await resizeImage(file);

        setEditPhotoURL(imageDataUrl);
        setEditPhotoPreview(imageDataUrl);
    };

    const handleBannerChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageDataUrl = await resizeImage(file);

        setEditBannerURL(imageDataUrl);
        setEditBannerPreview(imageDataUrl);
    };

    const openPhotoPicker = () => {
        photoInputRef.current?.click();
    };

    const openBannerPicker = () => {
        bannerInputRef.current?.click();
    };

    const normalizedListings = userListings.map((listing) => ({
        ...listing,
        pricePerDay: Number(listing.price ?? 0),
        deposit: Number(listing.deposit ?? 0),
        dateListed: listing.createdAt
            ? new Date(listing.createdAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        image: listing.image || listing.images?.[0] || '',
        location: listing.location || 'Location not provided',
    }));

    // Handle profile save
    const handleSaveProfile = async () => {
        if (!editName.trim()) {
            setMessage('Display name is required');
            return;
        }

        try {
            setSaving(true);
            setMessage('');
            
            await updateProfile({
                displayName: editName.trim() || profile?.displayName,
                bio: editBio.trim(),
                location: editLocation.trim(),
                photoURL: editPhotoURL || profile?.photoURL || DEFAULT_PROFILE_PICTURE,
                bannerURL: editBannerURL || profile?.bannerURL || DEFAULT_BANNER_PICTURE,
            });
            
            setMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error saving profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    // Handle cancel edit
    const handleCancel = () => {
        if (profile) {
            setEditName(profile.displayName || '');
            setEditBio(profile.bio || '');
            setEditLocation(profile.location || '');
            setEditPhotoPreview(editPhotoURL || profile.photoURL || DEFAULT_PROFILE_PICTURE);
            setEditBannerPreview(editBannerURL || profile.bannerURL || DEFAULT_BANNER_PICTURE);
        }
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner */}
            <div
                className="w-full h-64 bg-linear-to-r from-blue-500 to-purple-600 bg-cover bg-center"
                style={profile?.bannerURL ? { backgroundImage: `url(${profile.bannerURL})` } : undefined}
            ></div>

            {/* Profile Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="px-8 py-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            {/* Avatar */}
                            <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-400 to-purple-500 shrink-0 overflow-hidden border border-white/20">
                                <img
                                    src={avatarError ? DEFAULT_PROFILE_PICTURE : (profile?.photoURL || DEFAULT_PROFILE_PICTURE)}
                                    alt="Profile avatar"
                                    className="h-full w-full object-cover"
                                    onError={() => setAvatarError(true)}
                                />
                            </div>

                            {/* Profile Info */}
                            {!isEditing && (
                                <div className="flex-1 w-full">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {profile?.displayName || 'User Profile'}
                                    </h1>
                                    <p className="text-gray-600 mb-4">{profile?.email}</p>
                                    <p className="text-gray-700 mb-6 max-w-2xl">
                                        {profile?.bio || 'No bio added yet'}
                                    </p>
                                    <div className="flex gap-4 flex-wrap">
                                        {profile?.location && <span className="text-gray-600">📍 {profile.location}</span>}
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            )}

                            {/* Edit Mode */}
                            {isEditing && (
                                <div className="flex-1 w-full space-y-4">
                                    <div>
                                        <label htmlFor="profilePicture" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                                            Profile Picture
                                        </label>
                                        <ImageDropzoneProfile className="ml-1" onImageSelect={setEditPhotoURL} />
                                    </div>
                                    <div>
                                        <label htmlFor="profilePicture" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                                            Banner
                                        </label>
                                        <BannerDropzoneProfile className="ml-1" onImageSelect={setEditBannerURL} />
                                    </div>
                                    <div>
                                        <label htmlfor="displayName" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none hover:scale-101 transition-all duration-400 ease-out"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                                            Email (Read-only)
                                        </label>
                                        <input
                                            type="email"
                                            disabled
                                            placeholder={profile?.email}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="location" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={editLocation}
                                            onChange={(e) => setEditLocation(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none hover:scale-101 transition-all duration-400 ease-out"
                                            placeholder="City, State"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="userBio" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                                            User Bio
                                        </label>
                                        <textarea
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none hover:scale-101 transition-all duration-400 ease-out resize-none"
                                            placeholder="Tell others about yourself..."
                                        />
                                    </div>
                                    {message && (
                                        <div className={`p-3 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {message}
                                        </div>
                                    )}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-101 transition-all duration-400 ease-out disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 hover:scale-101 transition-all duration-400 ease-out"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ratings Section */}
                    <div className="border-t border-gray-200 px-8 py-8">
                        <h2 className="translate-x-1 text-2xl font-bold text-gray-900 mb-6">Ratings</h2>
                        <div className="bg-linear-to-br from-yellow-50 to-orange-50 p-6 rounded-lg mb-8">
                            <p className="text-sm text-gray-600 mb-2">Average Rating</p>
                            <div className="flex items-center gap-3">
                                <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < ratedStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        {reviewsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="text-gray-600 mt-4">Loading reviews...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <p className="text-gray-600 text-center py-8">No reviews yet</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-semibold text-gray-900">{review.reviewerName || 'Anonymous'}</p>
                                            <span className="text-sm text-gray-500">
                                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Listings Section */}
                    <div className="border-t border-gray-200 px-6 py-8">
                        <h2 className="translate-x-1 text-2xl font-bold text-gray-900 mb-6">Your Listings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {normalizedListings.map((listing) => (
                                <ListingCard key={listing.id} item={listing} />
                            ))}
                        </div>
                        {normalizedListings.length === 0 && (
                            <p className="text-gray-600 translate-x-1">No listings yet. Create your first listing!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}