import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, hasFirebaseConfig } from "../firebase";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ onLinkClick }) {
    const [mobileMenuOpen, setMobileMenuIsOpen] = useState(false);
    const [signingIn, setSigningIn] = useState(false);
    const location = useLocation();
    const { user, loading } = useAuth();

    const handleLinkClick = () => {
        if (onLinkClick) {
            onLinkClick();
        }
        setMobileMenuIsOpen(false);
    };

    const handleGoogleSignIn = async () => {
        if (!hasFirebaseConfig || !auth) {
            alert('Firebase is not configured. Add a .env.local file to enable sign-in.');
            return;
        }
        try {
            setSigningIn(true);
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setSigningIn(false);
        }
    };

    const handleLogout = async () => {
        if (!hasFirebaseConfig || !auth) {
            alert('Firebase is not configured.');
            return;
        }
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="sticky top-0 w-full bg-white backdrop-blur-sm z-50 transition-all shadow-md"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                <div className="flex items-center justify-between h-14 sm:h-16 md:h-16"> 
                    <div className="flex items-center space-x-2 group cursor-pointer">
                        <span className="group text-3xl lg:text-3xl font-bold hover:text-gray-300 transition-all duration-200">
                            <Link to="/" className="group gap-1 text-2xl lg:text-3xl font-bold transition-all duration-150 ease-in-out active:scale-99 inline-flex" onClick={() => handleLinkClick()}>
                                <span className="flex text-gray-600 group-hover:text-gray-400 transition-colors items-center"> 
                                    <div className="sm:w-36 sm:h-14 w-32 h-12 overflow-hidden bg-white flex items-center justify-center hover:scale-101 hover:opacity-50 transition-all duration-300 mt-2">
                                        <img src="/rentlalogonew.jpg" />
                                    </div>
                                </span>
                            </Link>
                        </span>
                    </div>
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link to="/create_listing" className={`text-base font-medium ${location.pathname === '/create_listing' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-400'}`} onClick={() => handleLinkClick()}>
                            Create Listing
                        </Link>
                        <Link to="/profile" className={`text-base font-medium ${location.pathname === '/profile' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-400'}`} onClick={() => handleLinkClick()}>
                            Profile
                        </Link>
                        <Link to="/contact" className={`text-base font-medium ${location.pathname === '/contact' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-400'}`} onClick={() => handleLinkClick()}>
                            Contact Us
                        </Link>
                        
                        {loading ? (
                            <div className="h-9 w-24 rounded-lg bg-gray-100 animate-pulse" />
                        ) : user ? (
                            <div className="flex items-center space-x-3 pl-6 border-l border-gray-300">
                                <span className="text-sm text-gray-600">{user?.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={signingIn}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                <LogIn className="h-4 w-4" />
                                {signingIn ? 'Signing in...' : 'Sign In'}
                            </button>
                        )}
                    </div>
                    <button className="lg:hidden p-2 focus:outline-none text-gray-600 hover:text-gray-300" onClick={() => setMobileMenuIsOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (<X className="h-5 w-5 sm:h-6 sm:w-6"/>) : (<Menu className="h-5 w-5 sm:h-6 sm:w-6"/>)}
                    </button>
                </div>
            </div> 
            {mobileMenuOpen && (
            <div className="absolute w-full lg:hidden bg-gray-100 backdrop-blur-sm px-4 pt-2 pb-4 space-y-2 slide-in-from-top shadow-md animate-in duration-400">
                <div className= "px-3 py-3 sm:px-3 sm:py-3 flex flex-col items-center space-y-3">
                    <Link to="/create_listing" className={`block text-sm lg:text-base font-medium ${location.pathname === '/create_listing' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => handleLinkClick()}>
                        Create Listing
                    </Link>
                    <Link to="/profile" className={`block text-sm lg:text-base font-medium ${location.pathname === '/profile' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => handleLinkClick()}>
                        Profile
                    </Link>
                    <Link to="/contact" className={`block text-sm lg:text-base font-medium ${location.pathname === '/contact' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => handleLinkClick()}>
                        Contact Us
                    </Link>
                    {loading ? (
                        <div className="h-9 w-24 rounded-lg bg-gray-100 animate-pulse" />
                    ) : user ? (
                        <div className="border-t border-gray-300 pt-3 w-full flex flex-col items-center space-y-2">
                            <span className="text-sm text-gray-600">{user?.email}</span>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    handleLinkClick();
                                }}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                handleGoogleSignIn();
                                handleLinkClick();
                            }}
                            disabled={signingIn}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 w-full justify-center"
                        >
                            <LogIn className="h-4 w-4" />
                            {signingIn ? 'Signing in...' : 'Sign In'}
                        </button>
                    )}
                </div>
            </div>
            )}
        </nav>
        )
}