import { useState } from 'react';
import { motion } from "framer-motion";
import { LogOut } from 'lucide-react';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

export default function ProfileSetup() {

    const { logout } = useAuth();
    const { user } = useAuth();
    const navigate = useNavigate(); 
    const { createProfile } = useUserProfile(user);
    
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        bio: '',
        tele_handle: '',
        location: ''
    });

    const isFormValid = 
        formData.displayName.trim() !== "" &&
        formData.tele_handle.trim() !== "" &&
        formData.location.trim() !== ""

    const [showModal, setShowModal] = useState(false);
    const [code, setCode] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');

    const submitCode = () => {
        console.log("Code submitted:", code);

        // verification logic here

        setShowModal(false);
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Clean telegram handle
        if (name === "tele_handle") {
            value = value.replace(/^@+/, "").trim();
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
        } else if (!formData.location.trim()) {
            setError('Location is required');
            return;
        }

        try {
            setSubmitLoading(true);
            setError('');
            
            await createProfile({
                displayName: formData.displayName,
                bio: formData.bio,
                phone: formData.phone,
                tele_handle: formData.tele_handle,
                location: formData.location
            });

            // Redirect to home page
            navigate('/');
        } catch (err) {
            setError('Error creating profile: ' + err.message);
            console.error(err);
        } finally {
            setSubmitLoading(false);
        }
    };

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
                    {/* Display Name */}
                    <div>
                        <label htmlFor="displayName" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
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
                        <label htmlFor="phone" className="translate-x-1 block text-sm font-medium text-gray-700 mb-2">
                            Telegram Handle *
                        </label>
                        <div className="flex items-center jusitfy-center gap-4">
                            <input
                                id="tele_handle"
                                name="tele_handle"
                                value={formData.tele_handle}
                                onChange={handleChange}
                                placeholder="@bobross"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none hover:scale-101 transition-all duration-400 ease-out"
                            />
                            <div>
                                {/* Telegram Verification */}
                                <button
                                    type="button"
                                    disabled={formData.tele_handle == ""}
                                    onClick={() => setShowModal(true)}
                                    className={`${showModal ? "opacity-50" : "opacity-100" } shrink-0 bg-blue-500 text-white font-medium p-2 px-3 rounded-md hover:bg-blue-600 hover:scale-101 transition-all duration-400 disabled:opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed`}
                                >
                                    {showModal ? 'Verifying...' : 'Verify'}
                                </button>    
                            </div>                   
                            {/* Modal */}
                            {showModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-black/40"/>
                                    <motion.div
                                        initial={{ y: "100%", opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: "100%", opacity: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeInOut"
                                        }}
                                        className="fixed inset-0 z-50 flex items-center justify-center"
                                    >
                                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                                            <h2 className="text-xl font-semibold mb-2">
                                                Enter Verification Code
                                            </h2>
                                            <p className="text-gray-500 text-sm mb-4">
                                                Please enter the code sent to your Telegram.
                                            </p>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={code}
                                                onChange={(e) => {setCode(e.target.value.replace(/\D/g, ""));}}
                                                placeholder="123456"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 hover:scale-101 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-400 ease-out"
                                            />
                                            <div className="flex justify-end gap-4">
                                                <button
                                                    onClick={() => setShowModal(false)}
                                                    className="px-4 py-2 rounded-lg border border-gray-300"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={submitCode}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                            </div>
                            
                        <p className="translate-x-1 mt-2 text-xs text-gray-500">
                            We will send a verification message to this handle
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
                        onClick={logout}
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
