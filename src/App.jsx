import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import CreateListing from './components/CreateListing.jsx';
import RentalMarketplace from './components/RentalMarketplace.jsx';
import Profile from './components/Profile.jsx';
import ContactUs from './components/ContactUs.jsx';
import Login from './components/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from "./components/AuthContext";
import './index.css';

function App() {

    const [blinkKey, setBlinkKey] = useState(Date.now());

    const handlePageBlink = () => {
    	setBlinkKey(Date.now());
  	};

	return (
		<AuthProvider>
			<div key={blinkKey} className="min-h-screen bg-gray-50 text-gray-600 animate-page-blink">
				<Navbar onLinkClick={handlePageBlink} />
				<Routes>
					<Route path="/" element={<RentalMarketplace />} />
					<Route path="/create_listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
					<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
					<Route path="/contact" element={<ContactUs />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</div>
		</AuthProvider>
		)
	}

export default App;
