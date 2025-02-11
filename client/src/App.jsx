import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './assets/Components/Navbar';
import Home from './assets/Pages/Home';
import Login from './assets/Pages/Login';
import Register from './assets/Pages/Register';
import MovieDetails from './assets/Pages/MovieDetails';
import AboutUs from './assets/Pages/AboutUs';
import Contact from './assets/Pages/Contact';
import Footer from './assets/Components/Footer';

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
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;