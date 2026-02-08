import { Menu } from "lucide-react";
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
                            <span className="text-white font-bold">Money</span>
                            <span className="text-blue-400 font-bold">Moves</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <a href="#features" className="text-gray-300 hover:text-white text-sm lg:text-base">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-300 hover:text-white text-sm lg:text-base">
                            Pricing
                        </a>
                        <a href="#testimonials" className="text-gray-300 hover:text-white text-sm lg:text-base">
                            Testimonials
                        </a>
                    </div>
                    <button className="md:hidden p-2 focus:outline-none text-gray-300 hover:text-white" onClick={() => setMobileMenuIsOpen(!mobileMenuOpen)}>
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6 "/>
                    </button>
                    {mobileMenuOpen && <p> hello </p>}
                </div>
            </div> 
            </nav>
}