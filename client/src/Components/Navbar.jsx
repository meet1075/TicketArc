import React, { useState } from 'react';
import { User, Ticket, LogIn, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/image/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Add your logout logic here
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-black/95 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:text-red-500 transition-colors">
              <img src={logo} className="h-8 w-auto" alt="Logo" />
              <span className="text-xl font-bold whitespace-nowrap">TicketArc</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links */}
          <div className={`absolute md:static top-16 left-0 w-full md:w-auto bg-black gap-5 md:bg-transparent p-4 md:p-0 transition-all duration-300
            ${menuOpen ? 'flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8' : 'hidden md:flex'}`}>
            
            <Link to="/" className="hover:text-red-500 transition-colors mt-2">Home</Link>
            <Link to="/bookings" className="flex items-center space-x-1 hover:text-red-500 transition-colors">
              <Ticket size={16} />
              <span>Bookings</span>
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;