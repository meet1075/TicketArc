import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Calendar, Clock, MapPin, Ticket, AlertCircle, LogIn, ArrowLeft, X, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // Adjust path
import axios from 'axios';
import ETicket from '../components/ETicket';
import { motion, AnimatePresence } from 'framer-motion';

function Bookings() {
  const { isLoggedIn } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showETicket, setShowETicket] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundStatus, setShowRefundStatus] = useState(false);
  const [refundStep, setRefundStep] = useState(0);


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

  const handleCancelTicket = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const processCancellation = async () => {
    setShowCancelModal(false);
    setShowRefundStatus(true);
    setRefundStep(0);

    try {
      // 1. Cancel the booking (this should also release seats and update booking status)
      await axios.delete(
        `http://localhost:3000/api/v1/booking/${selectedBooking._id}/cancel`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          withCredentials: true,
        }
      );

      // 2. Simulate refund status steps for UI
      setTimeout(() => setRefundStep(1), 1000); // Processing
      setTimeout(() => setRefundStep(2), 2500); // Completed
      setTimeout(() => {
        setRefundStep(3); // Cancelled
        setTimeout(() => {
          setShowRefundStatus(false);
          setRefundStep(0);
          // Remove the cancelled booking from the list
          setBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
          // Set a flag to refetch seats on TheaterSeating page
          sessionStorage.setItem('refetchSeatsAfterCancel', '1');
        }, 1500);
      }, 4000);

    } catch (error) {
      setShowRefundStatus(false);
      setRefundStep(0);
      alert("Failed to cancel booking. Please try again.");
    }
  };


  const handleLoginClick = () => {
    navigate('/login');
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return 'Invalid Date';
    const d = new Date(dateTime);
    return isNaN(d) ? 'Invalid Date' : d.toLocaleDateString();
  };
  const formatTime = (dateTime) => {
    if (!dateTime) return 'Invalid Date';
    const d = new Date(dateTime);
    return isNaN(d) ? 'Invalid Date' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
                      src={booking.movie?.movieImage || 'https://via.placeholder.com/150'}
                      alt={booking.movie?.title || 'Movie'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{booking.movie?.title || 'N/A'}</h3>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        Screen: {booking.showtime?.screen ?? 'N/A'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>Date: {formatDate(booking.showtime?.dateTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span>Time: {formatTime(booking.showtime?.dateTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span>Theater: {booking.theater?.name || 'Unknown'} ({booking.theater?.location || 'Unknown'})</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Ticket className="w-5 h-5 text-gray-500" />
                        <span>Seats: {Array.isArray(booking.seats) && booking.seats.length > 0 ? booking.seats.map((seat) => seat.seatNumber).join(', ') : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">
                          Booked on {formatDate(booking.bookingTime)}
                        </p>
                        <p className="text-lg font-bold">Total: ₹{booking.totalAmount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="flex space-x-3 mt-4 md:mt-0">
                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          onClick={() => { setSelectedBooking(booking); setShowETicket(true); }}
                        >
                          View E-Ticket
                        </button>
                        <button 
                        onClick={() => handleCancelTicket(booking)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                          Cancel Ticket
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

      {/* ETicket Modal */}
      {showETicket && selectedBooking && (
        <ETicket 
          booking={{
            movieTitle: selectedBooking.movie?.title || 'N/A',
            theater: `${selectedBooking.theater?.name || 'Unknown'} (${selectedBooking.theater?.location || 'Unknown'})`,
            date: formatDate(selectedBooking.showtime?.dateTime),
            time: formatTime(selectedBooking.showtime?.dateTime),
            seats: Array.isArray(selectedBooking.seats) ? selectedBooking.seats.map(seat => seat.seatNumber) : [],
            screen: `Screen ${selectedBooking.showtime?.screen ?? 'N/A'}`,
            totalAmount: selectedBooking.totalAmount || 0,
            bookingDate: formatDate(selectedBooking.bookingTime)
          }}
          onClose={() => setShowETicket(false)}
          isVisible={showETicket}
        />
      )}

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold dark:text-white">Cancel Ticket</h3>
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to cancel your ticket for {selectedBooking?.movieTitle}? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                >
                  No, Keep Ticket
                </button>
                <button
                  onClick={processCancellation}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Yes, Cancel Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Refund Status Modal */}
      <AnimatePresence>
        {showRefundStatus && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 text-center"
            >
              <div className="space-y-4">
                {refundStep === 0 && (
                  <>
                    <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto"></div>
                    <h3 className="text-xl font-bold dark:text-white">Processing Refund</h3>
                    <p className="text-gray-600 dark:text-gray-300">Please wait while we process your refund...</p>
                  </>
                )}
                {refundStep === 1 && (
                  <>
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto">
                      <Clock className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white">Refund Initiated</h3>
                    <p className="text-gray-600 dark:text-gray-300">Your refund is being processed...</p>
                  </>
                )}
                {refundStep === 2 && (
                  <>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white">Refund Completed</h3>
                    <p className="text-gray-600 dark:text-gray-300">Your refund has been processed successfully!</p>
                  </>
                )}
                {refundStep === 3 && (
                  <>
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white">Ticket Cancelled</h3>
                    <p className="text-gray-600 dark:text-gray-300">Your ticket has been cancelled successfully.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Bookings;