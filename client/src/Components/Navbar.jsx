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
          <Link to="/" className="flex items-center space-x-2 hover:text-red-500 transition-colors">
            <img src={logo} className="h-8 w-auto" alt="Logo" />
            <span className="text-xl font-bold">TicketArc</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
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

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-red-500 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-4">
            <Link 
              to="/" 
              className="block hover:text-red-500 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/bookings" 
              className="flex items-center space-x-1 hover:text-red-500 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Ticket size={16} />
              <span>Bookings</span>
            </Link>
            {isLoggedIn ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors w-full"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  handleLogin();
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors w-full"
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