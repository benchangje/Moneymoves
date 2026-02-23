import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ListingCard from './ListingCard';

export default function Profile() {
    const [username, setUsername] = useState("Benny Ben");
    const [profileImage, setProfileImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=BenChinese&hair=longHairStraight&hairColor=1a1a1a&accessories=prescription02&accessoriesProbability=100");
    const [bio, setBio] = useState("Passionate collector and renter of unique items. Always looking for great deals!");
    const [banner, setBanner] = useState("https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&h=300&fit=crop");
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(username);
    const [editImagePreview, setEditImagePreview] = useState(profileImage);
    const [editBio, setEditBio] = useState(bio);
    const [editBanner, setEditBanner] = useState(banner);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState(null);
    const placeholderImage = "https://via.placeholder.com/900x900.png?text=No+Image";
    const [sortOrder, setSortOrder] = useState('newest');
    const [selectedRating, setSelectedRating] = useState(null);

    const reviews = [
        { id: 1, reviewer: "Shree", rating: 5, comment: "Great experience! Item was in perfect condition. Highly recommended!", date: "2026-02-15" },
        { id: 2, reviewer: "Sean", rating: 5, comment: "Excellent service and communication. Would rent again!", date: "2026-02-10" },
        { id: 3, reviewer: "Luke", rating: 4, comment: "Good quality items, very professional. Minor issue with delivery but resolved quickly.", date: "2026-02-05" }
    ];

    // Load profile data from localStorage on component mount
    useEffect(() => {
        // Clear old localStorage data with via.placeholder URLs
        const savedProfile = localStorage.getItem('profileData');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                if (parsed.profileImage?.includes('picsum.photos') || parsed.banner?.includes('picsum.photos')) {
                    localStorage.removeItem('profileData');
                }
            } catch (e) {
                localStorage.removeItem('profileData');
            }
        }
    }, []);

    // Prevent background scroll and handle Escape key when image viewer OR edit modal is open
    useEffect(() => {
        const open = isImageOpen || isEditing;
        const previousOverflow = document.body.style.overflow;
        if (open) document.body.style.overflow = 'hidden';

        const onKey = (e) => {
            if (e.key === 'Escape') {
                if (isImageOpen) setIsImageOpen(false);
                if (isEditing) setIsEditing(false);
            }
        };

        if (open) document.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            if (open) document.removeEventListener('keydown', onKey);
        };
    }, [isImageOpen, isEditing]);

    // If the profile or preview image is an external SVG (e.g. DiceBear), try fetching
    // and embedding it as a data URL so browsers render it reliably when CORS or headers
    // cause the image to render invisible.
    useEffect(() => {
        let cancelled = false;

        const shouldFetch = (url) => {
            return typeof url === 'string' && url.includes('dicebear.com') && !url.startsWith('data:');
        };

        const fetchSvgToData = async (url, setter) => {
            try {
                const res = await fetch(url);
                if (!res.ok) return;
                const text = await res.text();
                if (!text || !text.trim().startsWith('<svg')) return;
                const data = `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
                if (!cancelled) setter(data);
            } catch (e) {
                // ignore fetch errors, keep original URL
            }
        };

        if (shouldFetch(profileImage)) fetchSvgToData(profileImage, setProfileImage);
        if (shouldFetch(editImagePreview)) fetchSvgToData(editImagePreview, setEditImagePreview);

        return () => { cancelled = true; };
    }, [profileImage, editImagePreview]);
    
    // Listings data
    const listings = [
        { id: 1, title: "PSA 10 Illustrator", price: "$1,000,000/month", image: "https://images2.minutemediacdn.com/image/upload/f_auto,q_auto,g_auto/images/voltaxMediaLibrary/mmsport/si_collects/01khhjv5j6z4rwpyn0yg.jpg" },
        { id: 2, title: "Camera Equipment", price: "$150/month", image: "https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=400&h=300&fit=crop" },
        { id: 3, title: "Camping Tent", price: "$50/month", image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop" }
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditBanner(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        setUsername(editName);
        setProfileImage(editImagePreview);
        setBio(editBio);
        setBanner(editBanner);
        
        // Save to localStorage
        const profileData = {
            username: editName,
            profileImage: editImagePreview,
            bio: editBio,
            banner: editBanner
        };
        localStorage.setItem('profileData', JSON.stringify(profileData));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditName(username);
        setEditImagePreview(profileImage);
        setEditBio(bio);
        setEditBanner(banner);
        setIsEditing(false);
    };

    // Calculate average rating
    const averageRatingNum = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
    const averageRating = averageRatingNum.toFixed(1);
    const ratedStars = Math.round(averageRatingNum);

    // Sort reviews based on selected order
    const sortedReviews = [...reviews]
        .filter(review => selectedRating === null || review.rating === selectedRating)
        .sort((a, b) => {
            if (sortOrder === 'worst-to-best') {
                return a.rating - b.rating;
            } else if (sortOrder === 'best-to-worst') {
                return b.rating - a.rating;
            } else {
                // newest first (default)
                return new Date(b.date) - new Date(a.date);
            }
        });

    // Calculate rating distribution
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
        ratingCounts[review.rating]++;
    });
    const maxCount = Math.max(...Object.values(ratingCounts), 1);

    return (
        <>
            <style>{`
                /* Global scrollbar for WebKit */
                body::-webkit-scrollbar { width: 12px; }
                body::-webkit-scrollbar-track { background: transparent; }
                body::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.18); border-radius: 9999px; border: 3px solid transparent; background-clip: padding-box; }
                body::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.28); }

                /* Modal / custom scroll area */
                .custom-scroll::-webkit-scrollbar { width: 10px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.14); border-radius: 9999px; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.24); }

                /* Firefox support */
                body { scrollbar-width: thin; scrollbar-color: rgba(148,163,184,0.18) transparent; }
                .custom-scroll { scrollbar-width: thin; scrollbar-color: rgba(148,163,184,0.14) transparent; }
            `}</style>

            <div className="min-h-screen bg-gradient-to-b from-sky-900 via-slate-900 to-slate-800 text-slate-100">
                <div className="max-w-7xl mx-auto pt-0">
                {/* Banner */}
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                    <button
                        onClick={() => { setModalImageSrc ? setModalImageSrc(banner) : null; setIsImageOpen(true); }}
                        className="w-full h-full p-0 m-0 block cursor-pointer"
                        aria-label="Open banner"
                    >
                        <img 
                            src={banner} 
                            alt="Profile Banner" 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImage; }}
                        />
                    </button>
                </div>

                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8 -mt-20 relative z-10 text-slate-100 border border-sky-800">
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex-shrink-0">
                                    <button 
                                        onClick={() => { setModalImageSrc(profileImage); setIsImageOpen(true); }}
                                        className="h-24 w-24 rounded-full border-4 border-blue-600 overflow-hidden p-0 m-0 cursor-pointer transform transition-transform duration-200 hover:scale-105 active:scale-95"
                                        aria-label="Open profile picture"
                                    >
                                        <img 
                                            src={profileImage} 
                                            alt="Profile" 
                                            className="h-24 w-24 rounded-full object-cover"
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImage; }}
                                            onLoad={(e) => { if (!e.currentTarget.naturalWidth || !e.currentTarget.naturalHeight) { e.currentTarget.src = placeholderImage; } }}
                                        />
                                    </button>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-sky-100 mb-2">
                                        {username}
                                    </h1>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => {
                                                const fillPercentage = Math.max(0, Math.min(1, averageRatingNum - i)) * 100;
                                                return (
                                                    <div key={i} className="relative inline-block text-gray-300">
                                                        <span className="text-lg">★</span>
                                                        <div 
                                                            className="absolute top-0 left-0 overflow-hidden text-yellow-400"
                                                            style={{ width: `${fillPercentage}%` }}
                                                        >
                                                            <span className="text-lg">★</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <span className="text-slate-200 font-semibold">{averageRating} ({reviews.length} reviews)</span>
                                    </div>
                                    <p className="text-slate-300 mb-3">Member since 2024</p>
                                    <p className="text-slate-200 max-w-sm">{bio}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm transform transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>

                {/* Listings Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-sky-200 mb-6">My Listings</h2>
                    <div className="flex flex-wrap gap-6">
                        {listings.map((listing) => (
                            <ListingCard key={listing.id} item={listing} />
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-sky-200">Reviews</h2>
                        <select 
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transform transition-transform duration-200 hover:scale-105 active:scale-95"
                        >
                            <option value="newest">Newest First</option>
                            <option value="worst-to-best">Worst to Best</option>
                            <option value="best-to-worst">Best to Worst</option>
                        </select>
                    </div>
                    
                    {/* Rating Statistics */}
                    <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-sky-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-sky-200">Rating Distribution</h3>
                            {selectedRating !== null && (
                                <button 
                                    onClick={() => setSelectedRating(null)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Show All
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map(rating => {
                                const count = ratingCounts[rating];
                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                const isSelected = selectedRating === rating;
                                return (
                                    <div 
                                        key={rating} 
                                        onClick={() => setSelectedRating(prev => prev === rating ? null : rating)}
                                        className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors ${
                                            isSelected ? 'bg-sky-700/20 ring-2 ring-sky-500' : 'hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1 w-16">
                                            <span className="text-sm font-medium text-slate-100">{rating}</span>
                                            <span className="text-yellow-400 text-sm">★</span>
                                        </div>
                                        <div className="flex-1 bg-slate-700 rounded-full h-4 overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-300 ${
                                                    isSelected ? 'bg-sky-500' : 'bg-yellow-400'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-slate-100 w-12 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {sortedReviews.length === 0 ? (
                            <div className="bg-slate-800 rounded-lg shadow-md p-12 text-center border border-sky-800">
                                <p className="text-slate-300 text-lg">There are currently no reviews</p>
                            </div>
                        ) : (
                            sortedReviews.map((review) => (
                                <div key={review.id} className="bg-slate-800 rounded-lg shadow-md p-6 border border-sky-800">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-sky-100">{review.reviewer}</h3>
                                            <p className="text-sm text-slate-400">{review.date}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? "text-yellow-400" : "text-slate-600"}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-200">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col border border-sky-800 text-slate-100">
                        <div className="flex justify-between items-center mb-6 p-6 pb-4">
                            <h2 className="text-2xl font-bold text-sky-100">Edit Profile</h2>
                            <button 
                                onClick={handleCancel}
                                className="text-slate-300 hover:text-slate-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 px-6 custom-scroll">

                        {/* Profile Picture Preview */}
                        <div className="mb-6 text-center">
                            <img 
                                src={editImagePreview} 
                                alt="Profile Preview" 
                                className="h-32 w-32 rounded-full border-4 border-sky-600 object-cover mx-auto mb-4"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImage; }}
                                onLoad={(e) => { if (!e.currentTarget.naturalWidth || !e.currentTarget.naturalHeight) { e.currentTarget.src = placeholderImage; } }}
                            />
                            <label className="block">
                                <span className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors inline-block">
                                    Change Picture
                                </span>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Banner Preview */}
                        <div className="mb-6 text-center">
                            <img 
                                src={editBanner} 
                                alt="Banner Preview" 
                                className="w-full h-20 object-cover rounded-lg mb-4"
                            />
                            <label className="block">
                                <span className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors inline-block">
                                    Change Banner
                                </span>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleBannerChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Name Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Name
                            </label>
                            <input 
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-sky-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-100"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Bio Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Bio
                            </label>
                            <textarea 
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 border border-sky-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none text-slate-100"
                                placeholder="Tell us about yourself"
                                rows="4"
                            />
                        </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 p-6 pt-4 border-t bg-slate-900 sticky bottom-0">
                            <button 
                                onClick={handleCancel}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveProfile}
                                className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Viewer Modal */}
            {isImageOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsImageOpen(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        onClick={() => setIsImageOpen(false)}
                        className="absolute top-6 right-6 z-60 bg-slate-800 rounded-full p-2 text-slate-100 hover:text-white shadow-lg"
                        aria-label="Close image"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-slate-900 p-2 rounded-lg flex items-center justify-center">
                            <div style={{ width: 'min(80vw, 80vh)', height: 'min(80vw, 80vh)' }} className="rounded-lg overflow-hidden bg-white shadow-sm">
                                <img
                                    src={modalImageSrc || profileImage}
                                    alt="Profile Large"
                                    className="w-full h-full object-cover block"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImage; }}
                                    onLoad={(e) => { if (!e.currentTarget.naturalWidth || !e.currentTarget.naturalHeight) { e.currentTarget.src = placeholderImage; } }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
}