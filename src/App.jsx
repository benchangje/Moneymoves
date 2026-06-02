import Navbar from './components/Navbar.jsx';
import CreateListing from './components/CreateListing.jsx';
import RentalMarketplace from './components/RentalMarketplace.jsx';
import Profile from './components/Profile.jsx';
import ProfileSetup from './components/ProfileSetup.jsx';
import ContactUs from './components/ContactUs.jsx';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';

function App() {
  const [blinkKey, setBlinkKey] = useState(Date.now());
  const { loading, error, user, needsProfileSetup } = useAuth();

  const handlePageBlink = () => {
    setBlinkKey(Date.now());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading MoneyMoves...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <p className="text-red-600 text-lg font-semibold mb-4">Initialization Error</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show profile setup for new users
  if (user && needsProfileSetup) {
    return <ProfileSetup />;
  }

  return (
    <div key={blinkKey} className="min-h-screen bg-white text-gray-600 animate-page-blink">
      <Navbar onLinkClick={handlePageBlink} />
      <Routes>
        <Route path="/" element={<RentalMarketplace />} />
        <Route path="/create_listing" element={<CreateListing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </div>
  )
}

export default App;
