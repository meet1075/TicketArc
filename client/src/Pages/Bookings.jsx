// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Booking = () => {
//   const [bookings, setBookings] = useState([]);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loggedInUser = JSON.parse(localStorage.getItem("user"));
//     if (!loggedInUser) {
//       setUser(null);
//       return;
//     }
//     setUser(loggedInUser);

//     axios.get("/api/bookings", { params: { userId: loggedInUser.id } })
//       .then(response => setBookings(response.data))
//       .catch(error => console.error("Error fetching bookings:", error));
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
//       <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
//         <h2 className="text-3xl font-semibold text-center mb-4">Previous Bookings</h2>
//         {user ? (
//           bookings.length > 0 ? (
//             <ul className="space-y-3">
//               {bookings.map((booking, index) => (
//                 <li key={index} className="p-3 border border-gray-700 rounded-lg bg-gray-700">
//                   <p><strong>Name:</strong> {booking.name}</p>
//                   <p><strong>Email:</strong> {booking.email}</p>
//                   <p><strong>Date:</strong> {booking.date}</p>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-center text-gray-400">There are no previous bookings.</p>
//           )
//         ) : (
//           <div className="text-center">
//             <p className="text-gray-400 mb-4">Please log in first to view your booking history.</p>
//             <button
//               onClick={() => navigate("/login")}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//             >
//               Login
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Booking;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Calendar, Clock, MapPin, Ticket, AlertCircle, LogIn } from 'lucide-react';

function Bookings() {
  const navigate = useNavigate();
  // This would come from your auth context in a real app
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Sample booking data (in a real app, this would come from your backend)
  const bookings = [
    {
      id: 'BKG001',
      movieTitle: 'Inception',
      poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      date: '2025-04-15',
      time: '6:00 PM',
      theater: 'Cinema City - Hall 3',
      seats: ['F5', 'F6', 'F7'],
      totalAmount: 45.00,
      bookingDate: '2025-04-10'
    },
    {
      id: 'BKG002',
      movieTitle: 'The Dark Knight',
      poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      date: '2025-04-20',
      time: '7:30 PM',
      theater: 'Cinema City - Hall 1',
      seats: ['D12', 'D13', 'D14', 'D15'],
      totalAmount: 60.00,
      bookingDate: '2025-04-12'
    }
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

  // For demo purposes - toggle login status
  const toggleLoginStatus = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-100">View and manage your movie ticket bookings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Demo toggle button - would be removed in production */}
        <button 
          onClick={toggleLoginStatus} 
          className="mb-8 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Demo: Toggle Login Status (Currently: {isLoggedIn ? 'Logged In' : 'Logged Out'})
        </button>

        {!isLoggedIn ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Please Sign In to View Your Bookings</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to be logged in to view your booking history and manage your tickets.
              Sign in to access all your past and upcoming movie bookings.
            </p>
            <button 
              onClick={handleLoginClick}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg mx-auto transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In Now</span>
            </button>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Your Booking History</h2>
            
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 lg:w-1/5">
                    <img 
                      src={booking.poster} 
                      alt={booking.movieTitle} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{booking.movieTitle}</h3>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        {booking.id}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>Date: {booking.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span>Time: {booking.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span>Theater: {booking.theater}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Ticket className="w-5 h-5 text-gray-500" />
                        <span>Seats: {booking.seats.join(', ')}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">Booked on {booking.bookingDate}</p>
                        <p className="text-lg font-bold">Total: ${booking.totalAmount.toFixed(2)}</p>
                      </div>
                      <div className="flex space-x-3 mt-4 md:mt-0">
                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          View E-Ticket
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                          Download Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <Film className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No Bookings Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet. Browse our movies and book your first ticket!
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;