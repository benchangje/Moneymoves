import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { X } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import CreateListing from './components/CreateListing.jsx';
import RentalMarketplace from './components/RentalMarketplace.jsx';
import Profile from './components/Profile.jsx';
import ContactUs from './components/ContactUs.jsx';
import Login from './components/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from "./components/useAuth";
import './index.css';

function App() {

    const [blinkKey, setBlinkKey] = useState(Date.now());

    const handlePageBlink = () => {
    	setBlinkKey(Date.now());
  	};

	const [showLogout, setShowLogout] = useState(false);
	const { logout } = useAuth();

	return (
		<div key={blinkKey} className="min-h-screen bg-gray-50 text-gray-600 animate-page-blink">
			{showLogout && (
				<div className="fixed w-full h-full bg-black/40 flex items-center justify-center z-60">
					<div className="bg-white rounded-lg p-6 pt-4 pb-6.5 flex flex-col items-start gap-4 mb-10 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
						<div className="flex flex-row items-start gap-20">
							<h2 className="text-2xl font-semibold text-gray-900">Confirm Logout</h2>
							<X className="h-6 w-6 text-gray-400 mt-1 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => setShowLogout(false)} />
						</div>
						<p className="text-base text-gray-900">
							Are you sure you want to logout?
						</p>
						<div className="flex flex-row gap-4 mt-2">
							<button
								onClick={() => {
									handlePageBlink();
									setShowLogout(false);
								}}
								className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									handlePageBlink();
									logout();
									setShowLogout(false);
								}}
								className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
							>
								Log out
							</button>
						</div>
					</div>
				</div>
			)}
			<Navbar onLinkClick={handlePageBlink} onLogoutClick={() => setShowLogout(true)} />
			<Routes>
				<Route path="/" element={<RentalMarketplace />} />
				<Route path="/create_listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
				<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
				<Route path="/contact" element={<ContactUs />} />
				<Route path="/login" element={<Login onLinkClick={handlePageBlink}/>} />
			</Routes>
		</div>
		)
	}

export default App;
