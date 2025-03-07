import React, { useState, useRef, useEffect } from 'react';
import { User, Ticket, LogIn, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/image/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock user data - in a real app, this would come from your auth context
  const user = {
    name: "John Doe",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDropdownOpen(false);
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
            
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                >
                  <img 
                    src={user.photo} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>Hello, {user.name}</span>
                  <ChevronDown size={16} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/bookings" 
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Bookings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/profile" 
                  className="block hover:text-red-500 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/bookings" 
                  className="block hover:text-red-500 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Bookings
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
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