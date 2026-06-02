import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import LogoutModal from "./components/LogoutModal.jsx";
import Navbar from "./components/Navbar.jsx";
import CreateListing from "./components/CreateListing.jsx";
import RentalMarketplace from "./components/RentalMarketplace.jsx";
import Profile from "./components/Profile.jsx";
import ContactUs from "./components/ContactUs.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfileSetup from "./components/ProfileSetup.jsx";
import SignUp from "./components/SignUp.jsx";
import { useAuth } from "./components/useAuth.js";
import { useBlink } from "./components/BlinkContext.jsx";
import { useNavigate, useLocation }	 from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./index.css";
import RentalMarketplace2 from "./components/RentalMarketplace.jsx";

function MainLayout( {onLogoutClick} ) {
	return (
		<div>
			<Navbar onLogoutClick={onLogoutClick} />
			<Outlet />	
		</div>
	);
}

function AuthLayout() {
    return (
		<Outlet />
	);
}

function App() {

	const { logout } = useAuth();
	const [showLogout, setShowLogout] = useState(false);
	const { blinkKey, handlePageBlink } = useBlink();
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<div key={blinkKey} className="animate-page-blink bg-gray-50">
			<AnimatePresence>
				{showLogout && (
					<LogoutModal
						onClose={() => setShowLogout(false)}
						onCancel={() => {setShowLogout(false)}}
						onLogout={() => {
							handlePageBlink();
							logout();
							setShowLogout(false);
							navigate('/login');
						}}
					/>
				)}
			</AnimatePresence>
			<Routes location={location} key={location.pathname}>
				<Route element={<MainLayout onLogoutClick={() => setShowLogout(true)} />}>
					<Route path="/" element={<RentalMarketplace />} />
					<Route path="/create_listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
					<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
					<Route path="/contact" element={<ContactUs />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login/>} />
					<Route path="/profile_setup" element={<ProfileSetup />} />
					<Route path="/signup" element={<SignUp />} />
				</Route>
			</Routes>
		</div>
		)
	}

export default App;
