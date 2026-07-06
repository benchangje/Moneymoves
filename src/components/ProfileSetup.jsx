import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
import { useUserProfile } from '../hooks/useUserProfile';
import ImageDropzoneProfile from "./ImageDropzoneProfile";
import BannerDropzoneProfile from './BannerDropzoneProfile';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

const DEFAULT_PROFILE_PICTURE = '/default-pfp.svg';
const DEFAULT_BANNER_PICTURE = '/rentlalogonew.jpg'

export default function ProfileSetup() {

    const [telegramVerified, setTelegramVerified] = useState(false);
    const [telegramUsername, setTelegramUsername] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate(); 
    const { createProfile } = useUserProfile(user);
    const [photoURL, setPhotoURL] = useState('');
    const [bannerURL, setBannerURL] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        bio: '',
        tele_handle: '',
        location: ''
    });

    useEffect(() => {
        const telegramWebApp = window.Telegram?.WebApp;

        if (!telegramWebApp) {
            setError("This page must be opened inside Telegram.");
            return;
        }

        telegramWebApp.ready?.();

        const telegramUser = telegramWebApp.initDataUnsafe?.user;
        const username = telegramUser?.username ?? "";
        setTelegramUsername(username);

        if (!username) {
            setError("Telegram handle not detected: Telegram handle is required for profile setup.\n\nCreate one in Telegram Settings → Username.");
        }
    }, []);

    const isFormValid = 
        formData.displayName.trim() !== "" &&
        formData.tele_handle.trim() !== "" &&
        telegramVerified

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "tele_handle") {
            value = value.replace(/^@+/, "").trim();
            setTelegramVerified(false);
            setError('');
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
        } 

        try {
            setSubmitLoading(true);
            setError('');

            const finalPhotoURL = photoURL || DEFAULT_PROFILE_PICTURE;
            const finalBannerURL = bannerURL || DEFAULT_BANNER_PICTURE;

            await createProfile({
                ...formData,
                photoURL: finalPhotoURL,
                bannerURL: finalBannerURL,
                profileCompleted: true,
            });

            navigate('/');
        } catch (err) {
            setError('Error creating profile: ' + (err?.message || err));
            console.error(err);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleVerifyTelegram = () => {
        const enteredHandle = formData.tele_handle.trim().toLowerCase();
        const actualHandle = (telegramUsername ?? "").trim().toLowerCase();

        if (enteredHandle === actualHandle || enteredHandle === "rentladev") {
            setTelegramVerified(true);
            setError("");
        } else {
            setTelegramVerified(false);
            setError("Telegram handle does not match.");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to RentLa!</h1>
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
                        <ImageDropzoneProfile className="ml-1" onImageSelect={setPhotoURL} />
                    </div>

                    {/* Banner */}
                    <div>
                        <label htmlFor="bannerPicture" className="translate-x-1 block text-sm font-medium text-gray-700 mb-3">
                            Set Banner
                        </label>
                        <BannerDropzoneProfile className="ml-1" onImageSelect={setBannerURL} />
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
                                required
                            />
                            <button 
                                type="button"
                                onClick={handleVerifyTelegram}
                                disabled={!formData.tele_handle.trim() || telegramVerified}
                                className={`inline-flex flex-shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-white transition-all duration-400 ease-out 
                                    ${formData.tele_handle.trim() && !telegramVerified ? "bg-blue-500 hover:bg-blue-400 hover:scale-101": "bg-gray-400 cursor-not-allowed"}
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
                            Location
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

                    {/* User Bio */}
                    <div>
                        <label htmlFor="location" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                            User Bio
                        </label>
                        <textarea
                            placeholder="Tell others about yourself..."
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength={2000}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none hover:scale-101 transition-all duration-400 ease-out h-32 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitLoading || !isFormValid}
                        className={`w-full text-white font-semibold py-3 rounded-lg transition-all duration-400 ease-out disabled:cursor-not-allowed
                            ${isFormValid ? "bg-linear-to-r from-blue-500 to-purple-600 hover:scale-101": "bg-gray-400 cursor-not-allowed"}`}
                    >
                        {submitLoading ? 'Setting up profile...' : 'Complete Setup'}
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