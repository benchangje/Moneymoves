import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./useAuth";

export default function Navbar({ onLinkClick }) {
    const [mobileMenuOpen, setMobileMenuIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLinkClick = () => {
        if (onLinkClick) onLinkClick();
        setMobileMenuIsOpen(false);
    };

    return (
        <nav className="sticky top-0 w-full bg-white backdrop-blur-sm z-50 transition-all shadow-md duration-400">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                <div className="flex items-center justify-between h-14 sm:h-16 md:h-16"> 
                    <div className="flex items-center space-x-2 group cursor-pointer">
                        <span className="text-2xl sm:text-2xl md:text-2xl font-bold">
                            <span className="group text-3xl lg:text-3xl font-bold hover:text-gray-300 transition-all duration-200">
                                <Link to="/" className="group flex gap-1 text-2xl lg:text-3xl font-bold transition-all duration-150 ease-in-out active:scale-99 inline-flex" onClick={() => handleLinkClick()}>
                                    <span className="flex text-gray-600 group-hover:text-gray-300 transition-colors items-center gap-1"> 
                                        <div className="sm:w-36 sm:h-16 w-32 h-14 overflow-hidden bg-white flex items-center justify-center hover:scale-101 hover:opacity-50 transition-all duration-300 rounded-lg pt-2">
                                            <img src="/rentlalogonew.jpg" className=""/>
                                        </div>
                                    </span>
                                </Link>
                            </span>
                        </span>
                    </div>
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link to="/create_listing" className={`text-base font-medium ${location.pathname === '/create_listing' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => handleLinkClick()}>
                            Create Listing
                        </Link>
                        <Link to="/profile" className={`text-base font-medium ${location.pathname === '/profile' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => handleLinkClick()}>
                            Profile
                        </Link>
                        <Link to="/contact" className={`text-base font-medium ${location.pathname === '/contact' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => handleLinkClick()}>
                            Contact Us
                        </Link>
                        {user ? (
                            <button 
                                onClick={async () => {
                                    await logout();
                                    navigate("/");
                                    handleLinkClick();
                                }}
                                className="text-base font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 pb-2 transition-colors duration-300 ease-in-out"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link 
                                to="/login"
                                onClick={handleLinkClick}
                                className="text-base font-medium rounded-lg bg-blue-500 hover:bg-blue-400 text-white px-4 py-1.5 pb-2 transition-colors duration-300 ease-in-out"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                    <button className="lg:hidden p-2 focus:outline-none text-gray-600 hover:text-gray-300" onClick={() => setMobileMenuIsOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (<X className="h-5 w-5 sm:h-6 sm:w-6"/>) : (<Menu className="h-5 w-5 sm:h-6 sm:w-6"/>)}
                    </button>
                </div>
            </div> 
            {mobileMenuOpen && 
            <div className="absolute w-full lg:hidden bg-gray-100 backdrop-blur-sm px-4 pt-2 pb-4 space-y-2 slide-in-from-top shadow-md animate-in duration-400">
                <div className= "px-3 py-3 sm:px-3 sm:py-3 flex flex-col items-center space-y-3">
                    <Link to="/create_listing" className={`block text-base font-medium ${location.pathname === '/create_listing' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => handleLinkClick()}>
                        Create Listing
                    </Link>
                    <Link to="/profile" className={`block text-base font-medium ${location.pathname === '/profile' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => handleLinkClick()}>
                        Profile
                    </Link>
                    <Link to="/contact" className={`block text-base font-medium ${location.pathname === '/contact' ? 'text-blue-500 hover:text-blue-300' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => handleLinkClick()}>
                        Contact Us
                    </Link>
                    {user ? (
                        <button 
                            onClick={async () => {
                                await logout();
                                handleLinkClick();
                                navigate("/");
                            }}
                            className="text-base font-medium text-red-600 hover:text-red-500 transition-colors duration-300 ease-in-out"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link 
                            to="/login" 
                            onClick={handleLinkClick} 
                            className="text-base font-medium text-blue-500 hover:text-blue-400 transition-colors duration-300 ease-in-out"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>}
        </nav>
        )
}