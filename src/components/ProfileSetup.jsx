import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';
import ImageDropzoneProfile from "./ImageDropzoneProfile";
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

export default function ProfileSetup() {

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
            setSubmitLoading(true);
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
            setSubmitLoading(false);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.08)] p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Rentla!</h1>
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none hover:scale-101 transition-all duration-400 ease-out"
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
                        <label htmlFor="location" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                            Location *
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, State"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none hover:scale-101 transition-all duration-400 ease-out"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell other users about yourself (optional)"
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none hover:scale-101 transition-all duration-400 ease-out resize-none"
                        />
                        <p className="translate-x-1 text-xs text-gray-500 mt-1">Max 500 characters</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid || submitLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 hover:scale-101 transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitLoading ? 'Setting up profile...' : 'Complete Setup'}
                    </button>

                    <p className="text-sm text-gray-500 text-center">
                        * Required field
                    </p>
                </form>
                <div className="mt-6 p-4 bg-gray-200 rounded-lg">
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