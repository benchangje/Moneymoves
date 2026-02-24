import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuIsOpen] = useState(false);
    return <nav className="fixed top-0 w-full bg-white backdrop-blur-sm z-50 transition-all duration-400">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                <div className="flex items-center justify-between h-24 sm:h-28 md:h-28"> 
                    <div className="flex items-center group cursor-pointer">
                        <img src="/logo2.png" alt="logo" className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain"/>
                    </div>
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link to="/create_listing" className="text-gray-600 hover:text-gray-300 text-sm lg:text-base font-medium">
                            Create Listing
                        </Link>
                        <Link to="/view_listings" className="text-gray-600 hover:text-gray-300 text-sm lg:text-base font-medium">
                            View Listings
                        </Link>
                        <Link to="/profile" className="text-gray-600 hover:text-gray-300 text-sm lg:text-base font-medium">
                            Profile
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-gray-300 text-sm lg:text-base font-medium">
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
                    <Link to="/create_listing" className="block text-gray-600 hover:text-gray-300 text-sm lg:text-base font-medium" onClick={() => setMobileMenuIsOpen(false)}>
                        Create Listing
                    </Link>
                    <Link to="/view_listings" className="block text-gray-600 hover:text-gray-300 text-sm lg:text-base font-medium" onClick={() => setMobileMenuIsOpen(false)}>
                        View Listings
                    </Link>
                    <Link to="/profile" className="block text-gray-600 hover:text-gray-300 text-sm lg:text-base font-medium" onClick={() => setMobileMenuIsOpen(false)}>
                        Profile
                    </Link>
                    <Link to="/contact" className="block text-gray-600 hover:text-gray-300 text-sm lg:text-base font-medium" onClick={() => setMobileMenuIsOpen(false)}>
                        Contact Us
                    </Link>
                </div>
            </div>}
            </nav>
}