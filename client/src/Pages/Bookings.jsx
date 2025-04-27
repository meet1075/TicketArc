import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Calendar, Clock, MapPin, Ticket, AlertCircle, LogIn, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // Adjust path
import axios from 'axios';

function Bookings() {
  const { isLoggedIn } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/user/booking-history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        withCredentials: true,
      });
      if (response.status === 200) {
        setBookings(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const formatDate = (dateTime) => new Date(dateTime).toLocaleDateString();
  const formatTime = (dateTime) => new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-100">View and manage your movie ticket bookings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Your Booking History</h2>
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 lg:w-1/5">
                    <img
                      src={booking.movie.movieImage || 'https://via.placeholder.com/150'}
                      alt={booking.movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{booking.movie.title}</h3>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        {booking._id}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>Date: {formatDate(booking.showtime.dateTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span>Time: {formatTime(booking.showtime.dateTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span>Theater: {booking.showtime.screen || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Ticket className="w-5 h-5 text-gray-500" />
                        <span>Seats: {booking.seats.map((seat) => seat.seatNumber).join(', ') || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">
                          Booked on {formatDate(booking.bookingTime)}
                        </p>
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