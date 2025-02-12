import React from 'react';
import { Film, User, Ticket, LogIn } from 'lucide-react';
import logo from "../assets/image/logo.png"
const Navbar = () => {
  const isLoggedIn = false; // This will be managed by auth state later

  return (
    <nav className="fixed top-0 w-full bg-black/95 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-1 hover:text-red-500 transition-colors">
            <img src = {logo} className='mt-9 mb-7 mr-2 h-7 w-15'></img>
            <span className="text-xl font-bold">TicketArc</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-8">
            <a href="/" className="hover:text-red-500 transition-colors">Home</a>
            <a href="/bookings" className="flex items-center space-x-1 hover:text-red-500 transition-colors">
              <Ticket size={16} />
              <span>Bookings</span>
            </a>
            {isLoggedIn ? (
              <>
                <a href="/profile" className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                  <User size={16} />
                  <span>Profile</span>
                </a>
                <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <button className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors">
            <a href="/login" className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                <LogIn size={16} />
                <span>Login</span>
            </a>
                
                
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
