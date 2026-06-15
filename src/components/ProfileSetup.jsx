import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';
import ImageDropzoneProfile from "./ImageDropzoneProfile";
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

const DEFAULT_PROFILE_PICTURE = '/default-pfp.svg';

    const [telegramVerified, setTelegramVerified] = useState(false);
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const telegramUsername = telegramUser?.username ?? "";
    const { logout } = useAuth();
    const { user } = useAuth();
    const navigate = useNavigate(); 
    const { createProfile } = useUserProfile(user);
    const [profileImage, setProfileImage] = useState('');
    
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        bio: '',
        tele_handle: telegramUsername,
        location: ''
    });

    const isFormValid = 
        formData.displayName.trim() !== "" &&
        formData.tele_handle.trim() !== "" &&
        formData.location.trim() !== ""

    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "tele_handle") {
            value = value.replace(/^@+/, "").trim();
            setTelegramVerified(false);
        }

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
        } else if (!formData.tele_handle.trim()) {
            setError('Telegram Handle is required');
            return;
        } else if (!telegramVerified) {
            setError("Telegram handle verification is required");
            return;
        } else if (!formData.location.trim()) {
            setError('Location is required');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            await createProfile({
                ...formData,
                profileImage,
                profileCompleted: true
            });

            navigate('/');
        } catch (err) {
            setError('Error creating profile: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyTelegram = () => {
        const enteredHandle = formData.tele_handle.toLowerCase();
        const actualHandle = telegramUsername.toLowerCase();

        if (enteredHandle === actualHandle) {
            setTelegramVerified(true);
            setError("");
        } else {
            setTelegramVerified(false);
            setError("Telegram handle does not match.");
        }
    };

    useEffect(() => {
        if (!telegramUsername) {
            setError("Telegram handle not detected: Telegram handle is required for profile setup.\n\nCreate one in Telegram Settings → Username.");
        }
    }, [telegramUsername]);

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

                    {/* Profile Picture */}
                    <div>
                        <label htmlFor="profilePicture" className="translate-x-1 block text-sm font-medium text-gray-700 mb-3">
                            Set Profile Picture 
                        </label>
                        <ImageDropzoneProfile className="ml-1" onImageSelect={(imageDataUrl) => setProfileImage(imageDataUrl)} />
                    </div>

                    {/* Display Name */}
                    <div>
                        <label htmlFor="displayName" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                            Display Name *
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
                    
                    {/* Telegram Handle */}
                    <div>
                        <label htmlFor="tele_handle" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                            Telegram Handle *
                        </label>
                        <div className="flex items-center justify-center gap-3">
                            <input
                                id="tele_handle"
                                name="tele_handle"
                                value={formData.tele_handle}
                                onChange={handleChange}
                                placeholder="@bobross"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none hover:scale-101 transition-all duration-400 ease-out"
                            />
                            <button 
                                type="button"
                                onClick={handleVerifyTelegram}
                                disabled={!formData.tele_handle.trim() || !telegramUsername || telegramVerified}
                                className={`rounded-lg p-2 px-3 text-white transition-all duration-400 ease-out 
                                    ${formData.tele_handle.trim() && telegramUsername && !telegramVerified ? "bg-blue-500 hover:bg-blue-400 hover:scale-101": "bg-gray-400 cursor-not-allowed"}
                                    ${telegramVerified ? "bg-gradient-to-r from-blue-500/50 to-purple-600/50 cursor-not-allowed" : ""}`}
                            >
                                {telegramVerified ? "Verified ✓" : "Verify"}
                            </button>
                        </div>
                        <p className="translate-x-1 mt-2 text-xs text-gray-500">
                            Other users will use this to contact you on Telegram
                        </p>
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
                <div className="mt-6 hover:scale-101 transition-all duration-300">
                    <Link
                        to="/"
                        className="relative w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-400 flex items-center justify-center"
                    >
                        <LogOut className="h-5 w-5 absolute left-4" aria-hidden="true" />
                        <span className="w-full text-center">Cancel setup</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}