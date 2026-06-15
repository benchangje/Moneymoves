import { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';

const DEFAULT_PROFILE_PICTURE = '/default-pfp.svg';

export default function ProfileSetup() {
    const { user, completeProfileSetup } = useAuth();
    const { createProfile } = useUserProfile(user);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        bio: '',
        phone: '',
        location: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');
    const photoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0] || null;
        setPhotoFile(file);
        setPhotoPreview(file ? URL.createObjectURL(file) : '');
    };

    const handleBannerChange = (e) => {
        const file = e.target.files?.[0] || null;
        setBannerFile(file);
        setBannerPreview(file ? URL.createObjectURL(file) : '');
    };

    const openPhotoPicker = () => {
        photoInputRef.current?.click();
    };

    const openBannerPicker = () => {
        bannerInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.displayName.trim()) {
            setError('Name is required');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            await createProfile({
                displayName: formData.displayName,
                bio: formData.bio,
                phone: formData.phone,
                location: formData.location,
                photoFile,
                bannerFile
            });

            // Mark setup as complete in context and localStorage
            completeProfileSetup();
            localStorage.setItem(`profile_setup_${user.uid}`, 'true');
            
            // Redirect to home page
            navigate('/');
        } catch (err) {
            setError('Error creating profile: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MoneyMoves!</h1>
                    <p className="text-gray-600">Let's set up your profile</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Display Name */}
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell other users about yourself (optional)"
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, State"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="photoFile" className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Picture
                        </label>
                        <input ref={photoInputRef} type="file" id="photoFile" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        <button
                            type="button"
                            onClick={openPhotoPicker}
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                            Add profile picture
                        </button>
                        {photoPreview && (
                            <img src={photoPreview} alt="Profile preview" className="mt-3 h-24 w-24 rounded-full object-cover border" />
                        )}
                        {!photoPreview && (
                            <img src={DEFAULT_PROFILE_PICTURE} alt="Default profile preview" className="mt-3 h-24 w-24 rounded-full object-cover border" />
                        )}
                    </div>

                    <div>
                        <label htmlFor="bannerFile" className="block text-sm font-medium text-gray-700 mb-2">
                            Banner Picture
                        </label>
                        <input ref={bannerInputRef} type="file" id="bannerFile" accept="image/*" onChange={handleBannerChange} className="hidden" />
                        <button
                            type="button"
                            onClick={openBannerPicker}
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                            Add banner picture
                        </button>
                        {bannerPreview && (
                            <img src={bannerPreview} alt="Banner preview" className="mt-3 h-28 w-full rounded-lg object-cover border" />
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Setting up profile...' : 'Complete Setup'}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                        * Required field
                    </p>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Email:</span> {user?.email}
                    </p>
                </div>
            </div>
        </div>
    );
}
