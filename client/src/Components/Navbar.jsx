import React, { useState, useRef, useEffect, useContext } from 'react';
import { User, Ticket, LogIn, Menu, X, LogOut, ChevronDown, Bell, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import logo from "../assets/image/logo.png";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleLogin = () => navigate('/login');

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  return (
    <nav className="fixed top-0 w-full bg-black/95 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 hover:text-red-500 transition-colors">
            <img src={logo} className="h-8 w-auto" alt="Logo" />
            <span className="text-base md:text-xl font-bold">TicketArc</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm md:text-base hover:text-red-500 transition-colors">Home</Link>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center space-x-4">
                  <button className="relative hover:text-red-500 transition-colors">
                    <Bell size={20} />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>

                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                  >
                    <img 
                      src={user?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                      alt={user?.name || "User"}
                      className="w-8 h-8 rounded-full border-2 border-transparent hover:border-red-500 transition-colors"
                    />
                    <span className="text-sm md:text-base">Hello, {user?.fullName || "User"}</span>
                    <ChevronDown size={16} className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 text-gray-800"
                    >
                      {/* <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Loyalty Points</p>
                        <p className="font-bold text-red-500">{user?.points || 0} points</p>
                      </div> */}
                      <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors">
                        <User size={16} className="mr-2" />
                        <span>Profile</span>
                      </Link>
                      <Link to="/bookings" className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors">
                        <Ticket size={16} className="mr-2" />
                        <span>Bookings</span>
                      </Link>
                      {/* <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors">
                        <Settings size={16} className="mr-2" />
                        <span>Settings</span>
                      </Link> */}
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition-colors">
                        <LogOut size={16} className="mr-2" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors text-sm md:text-base"
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
            )}
          </div>

          <button 
            className="md:hidden p-2 hover:bg-red-500 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                <Link to="/" className="block hover:text-red-500 transition-colors text-sm">Home</Link>
                
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center justify-between py-2 border-t border-gray-700">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={user?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                          alt={user?.name || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">{user?.fullName || "User"}</span>
                      </div>
                      {notifications > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {notifications} new
                        </span>
                      )}
                    </div>
                    <Link to="/profile" className="block hover:text-red-500 transition-colors text-sm">Profile</Link>
                    <Link to="/bookings" className="block hover:text-red-500 transition-colors text-sm">Bookings</Link>
                    <Link to="/settings" className="block hover:text-red-500 transition-colors text-sm">Settings</Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left text-red-500 hover:text-red-600 transition-colors text-sm"
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
                    className="flex items-center space-x-1 hover:bg-red-500 py-2 rounded-md transition-colors w-full text-sm"
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;