import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import MovieDetails from './Pages/MovieDetails';
import AboutUs from './Pages/AboutUs';
import Contact from './Pages/Contact';
import Footer from './Components/Footer';
import TheaterSeating from './Components/TheaterSeating';
import Bookings from './Pages/Bookings';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/TheaterSeating" element={<TheaterSeating />}/>
          <Route path="/Bookings" element={<Bookings />} />


        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;