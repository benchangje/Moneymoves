import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuIsOpen] = useState(false);
    const location = useLocation();
    return <nav className="fixed top-0 w-full bg-white backdrop-blur-sm z-50 transition-all duration-400">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                <div className="flex items-center justify-between h-14 sm:h-16 md"> 
                    <div className="flex items-center space-x-2 group cursor-pointer">
                        <div> 
                            <img src="/logo.png" alt="logo" className="h-6 w-6 sm:h-8 sm:w-8"/>
                        </div>
                        <span className="text-lg sm:text-xl md:text-2xl font-bold">
                            <span className="text-black font-bold">Rental </span>
                            <span className="text-blue-600 font-bold">Marketplace</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link to="/create_listing" className={`text-sm lg:text-base font-medium ${location.pathname === '/create_listing' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-300'}`}>
                            Create Listing
                        </Link>
                        <Link to="/view_listings" className={`text-sm lg:text-base font-medium ${location.pathname === '/view_listings' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-300'}`}>
                            View Listings
                        </Link>
                        <Link to="/profile" className={`text-sm lg:text-base font-medium ${location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-300'}`}>
                            Profile
                        </Link>
                        <Link to="/contact" className={`text-sm lg:text-base font-medium ${location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-300'}`}>
                            Contact Us
                        </Link>
                    </div>
                    <button className="md:hidden p-2 focus:outline-none text-gray-600 hover:text-gray-300" onClick={() => setMobileMenuIsOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (<X className="h-5 w-5 sm:h-6 sm:w-6"/>) : (<Menu className="h-5 w-5 sm:h-6 sm:w-6"/>)}
                    </button>
                </div>
            </div> 
            {mobileMenuOpen && 
            <div className="md:hidden bg-gray-100 backdrop-blur-sm px-4 pt-2 pb-4 space-y-2 slide-in-from-top animate-in duration-400">
                <div className= "px-3 py-3 sm:px-3 sm:py-3 flex flex-col items-center space-y-3">
                    <Link to="/create_listing" className={`block text-sm lg:text-base font-medium ${location.pathname === '/create_listing' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => setMobileMenuIsOpen(false)}>
                        Create Listing
                    </Link>
                    <Link to="/view_listings" className={`block text-sm lg:text-base font-medium ${location.pathname === '/view_listings' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => setMobileMenuIsOpen(false)}>
                        View Listings
                    </Link>
                    <Link to="/profile" className={`block text-sm lg:text-base font-medium ${location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => setMobileMenuIsOpen(false)}>
                        Profile
                    </Link>
                    <Link to="/contact" className={`block text-sm lg:text-base font-medium ${location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-300'}`} onClick={() => setMobileMenuIsOpen(false)}>
                        Contact Us
                    </Link>
                </div>
            </div>}
            </nav>
}