import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home';
import Login from './pages/Login.jsx';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import TheaterSeating from './components/TheaterSeating.jsx';
import Bookings from './pages/Bookings';
import AdminHome from './pages/AdminHome';
import PrivacyPolicy from './pages/Policy';
import TermsConditions from './pages/TermsConditions';
import Payment from './pages/Payment.jsx';
// import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
          <Navbar /> {/* Navbar always shows, auth will handle login/logout */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/theater-seating/:movieId/:screenId/:showtimeId" element={<TheaterSeating />} />
              <Route path="/theater-seating/:movieId/:cinemaId/:showtime" element={<TheaterSeating />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              {/* <Route path="/settings" element={<Settings />} /> */}
            </Routes>
          </div>
          <Footer /> {/* Footer always shows */}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;