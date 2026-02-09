import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuIsOpen] = useState(false);
    return <nav className="fixed top-0 w-full bg-slate-950/20 backdrop-blur-sm z-50 transition-all duration-300">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                <div className="flex items-center justify-between h-14 sm:h-16 md"> 
                    <div className="flex items-center space-x-2 group cursor-pointer">
                        <div> 
                            <img src="/logo.png" alt="logo" className="h-6 w-6 sm:h-8 sm:w-8"/>
                        </div>
                        <span className="text-lg sm:text-xl md:text-2xl font-bold">
                            <span className="text-white font-bold">Rental </span>
                            <span className="text-blue-400 font-bold">Marketplace</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <a href="#features" className="text-gray-300 hover:text-white text-sm lg:text-base">
                            Create Listing
                        </a>
                        <a href="#pricing" className="text-gray-300 hover:text-white text-sm lg:text-base">
                            View Listings
                        </a>
                        <a href="#testimonials" className="text-gray-300 hover:text-white text-sm lg:text-base">
                            Profile
                        </a>
                        <a href="#contact" className="text-gray-300 hover:text-white text-sm lg:text-base">
                            Contact Us
                        </a>
                    </div>
                    <button className="md:hidden p-2 focus:outline-none text-gray-300 hover:text-white" onClick={() => setMobileMenuIsOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (<X className="h-5 w-5 sm:h-6 sm:w-6"/>) : (<Menu className="h-5 w-5 sm:h-6 sm:w-6"/>)}
                    </button>
                </div>
            </div> 
            {mobileMenuOpen && 
            <div className="md:hidden bg-slate-900/90 backdrop-blur-sm px-4 pt-2 pb-4 space-y-2 slide-in-from-top animate-in duration-400">
                <div className= "px-3 py-3 sm:px-3 sm:py-3 flex flex-col items-center space-y-3">
                    <a href="#features" className="block text-gray-300 hover:text-white text-sm lg:text-base font-medium" onClick={() => setMobileMenuIsOpen(false)}>
                        Create Listing
                    </a>
                    <a href="#pricing" className="block text-gray-300 hover:text-white text-sm lg:text-base font-medium" onClick={() => setMobileMenuIsOpen(false)}>
                        View Listings
                    </a>
                    <a href="#testimonials" className="block text-gray-300 hover:text-white text-sm lg:text-base font-medium" onClick={() => setMobileMenuIsOpen(false)}>
                        Profile
                    </a>
                    <a href="#contact" className="block text-gray-300 hover:text-white text-sm lg:text-base font-medium" onClick={() => setMobileMenuIsOpen(false)}>
                        Contact Us
                    </a>
                </div>
            </div>}
            </nav>
}