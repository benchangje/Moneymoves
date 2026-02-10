import Navbar from './components/Navbar.jsx';
import CreateListing from './components/CreateListing.jsx';
import ViewListings from './components/ViewListings.jsx';
import Profile from './components/Profile.jsx';
import ContactUs from './components/ContactUs.jsx';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="min-h-screen bg-white text-gray-600">
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/view_listings" element={<ViewListings />} />
        <Route path="/create_listing" element={<CreateListing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </div>
  )
}

export default App
