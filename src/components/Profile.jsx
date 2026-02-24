import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50 pb-6">
            <div className="max-w-7xl mx-auto">
                {/* Banner */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img 
                        src={banner} 
                        alt="Profile Banner" 
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="px-6 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8 -mt-12 relative z-10">
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex-shrink-0">
                                    <img 
                                        src={profileImage} 
                                        alt="Profile" 
                                        className="h-24 w-24 rounded-full border-4 border-blue-600 object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
                                        <span className="text-gray-700 font-semibold">{averageRating} ({reviews.length} reviews)</span>
                                    </div>
                                    <p className="text-gray-600 mb-3">Member since 2024</p>
                                    <p className="text-gray-700 max-w-sm">{bio}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>

                {/* Listings Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Listings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-gray-200 overflow-hidden">
                                    <img 
                                        src={listing.image} 
                                        alt={listing.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {listing.title}
                                    </h3>
                                    <p className="text-blue-600 font-bold text-lg">
                                        {listing.price}
                                    </p>
                                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                        <select 
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="worst-to-best">Worst to Best</option>
                            <option value="best-to-worst">Best to Worst</option>
                        </select>
                    </div>
                    
                    {/* Rating Statistics */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
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
                                        onClick={() => setSelectedRating(rating)}
                                        className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors ${
                                            isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1 w-16">
                                            <span className="text-sm font-medium text-gray-700">{rating}</span>
                                            <span className="text-yellow-400 text-sm">★</span>
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-300 ${
                                                    isSelected ? 'bg-blue-500' : 'bg-yellow-400'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 w-12 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {sortedReviews.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <p className="text-gray-500 text-lg">There are currently no reviews</p>
                            </div>
                        ) : (
                            sortedReviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{review.reviewer}</h3>
                                            <p className="text-sm text-gray-500">{review.date}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
                        <div className="flex justify-between items-center mb-6 p-8 pb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                            <button 
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 px-8">

                        {/* Profile Picture Preview */}
                        <div className="mb-6 text-center">
                            <img 
                                src={editImagePreview} 
                                alt="Profile Preview" 
                                className="h-32 w-32 rounded-full border-4 border-blue-600 object-cover mx-auto mb-4"
                            />
                            <label className="block">
                                <span className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors inline-block">
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
                                className="w-full h-24 object-cover rounded-lg mb-4"
                            />
                            <label className="block">
                                <span className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors inline-block">
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input 
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Bio Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea 
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                placeholder="Tell us about yourself"
                                rows="4"
                            />
                        </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 p-8 pt-6 border-t bg-white sticky bottom-0">
                            <button 
                                onClick={handleCancel}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveProfile}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}