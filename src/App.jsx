import Navbar from './components/Navbar.jsx';
import CreateListing from './components/CreateListing.jsx';
import ViewListings from './components/ViewListings.jsx';
import Profile from './components/Profile.jsx';
import ContactUs from './components/ContactUs.jsx';
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden flex items-center justify-center">
      <Navbar />
      <CreateListing />
      <ViewListings />
      <Profile />
      <ContactUs />
    </div>
  )
}

export default App
