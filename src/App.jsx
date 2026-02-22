import Navbar from './components/Navbar.jsx';
import CreateListing from './components/CreateListing.jsx';
import RentalMarketplace from './components/RentalMarketplace.jsx';
import Profile from './components/Profile.jsx';
import ContactUs from './components/ContactUs.jsx';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="min-h-screen bg-white text-gray-600 pt-20">
      <Navbar />
      <Routes>
        <Route path="/" element={<RentalMarketplace />} />
        <Route path="/rental_marketplace" element={<RentalMarketplace />} />
        <Route path="/create_listing" element={<CreateListing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </div>
  )
}

export default App;
