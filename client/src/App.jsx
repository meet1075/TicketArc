import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import TheaterSeating from './components/TheaterSeating';
import Bookings from './pages/Bookings';
import AdminHome from './pages/AdminHome';
import PrivacyPolicy from './pages/Policy';
import TermsConditions from './pages/TermsConditions';

function App() {
  // This would come from your auth context in a real app
  const isAdmin = false;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAdmin && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/theater-seating/:movieId/:cinemaId/:showtime" element={<TheaterSeating />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
        </Routes>
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;