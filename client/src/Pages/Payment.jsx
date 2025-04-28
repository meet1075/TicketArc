import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('pending');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showtimeDetails, setShowtimeDetails] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [sessionExpired, setSessionExpired] = useState(false);

  const { state } = location;

  const bookingDetails = state || {
    movieTitle: "N/A",
    showtime: "N/A",
    seats: [],
    totalAmount: 0,
    theater: "N/A",
    location: "N/A"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (bookingDetails.showtimeId) {
      fetchShowtimeDetails();
    }
  }, [bookingDetails.showtimeId]);

  useEffect(() => {
    if (status === 'completed' || status === 'failed') return; // Don't run timer if payment is done/failed
    if (timeLeft <= 0) {
      setSessionExpired(true);
      // Optionally, call API to release reserved seats here
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const fetchShowtimeDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:3000/api/v1/showtime/getShowtime/${bookingDetails.showtimeId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setShowtimeDetails(response.data.data);
    } catch (err) {
      setFetchError(err.response?.data?.message || 'Failed to fetch showtime details');
      console.error('Error fetching showtime:', err);
    }
  };

  const validateForm = () => {
    const errors = {};
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/(20[2-9][0-9]|2[1-9][0-9]{2})$/;
    const cvvRegex = /^\d{3,}$/;
    const upiIdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

    if (paymentMethod !== 'upi') {
      if (!formData.cardNumber) {
        errors.cardNumber = 'Card number is required';
      } else if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Invalid card number';
      }

      if (!formData.expiryDate) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!expiryDateRegex.test(formData.expiryDate)) {
        errors.expiryDate = 'Invalid expiry date (MM/YYYY)';
      }

      if (!formData.cvv) {
        errors.cvv = 'CVV is required';
      } else if (!cvvRegex.test(formData.cvv)) {
        errors.cvv = 'CVV must be at least 3 digits';
      }
    } else {
      if (!formData.upiId) {
        errors.upiId = 'UPI ID is required';
      } else if (!upiIdRegex.test(formData.upiId)) {
        errors.upiId = 'Invalid UPI ID';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      // Create payment for each selected seat
      const paymentPromises = bookingDetails.seatAvailabilityIds.map(async (seatAvailabilityId) => {
        const paymentResponse = await axios.post(
          'http://localhost:3000/api/v1/payment/createPayment',
          {
            seatAvailabilityId,
            paymentMethod: paymentMethod === 'credit' ? 'Credit Card' : paymentMethod === 'debit' ? 'Debit Card' : 'UPI',
            transactionId: uuidv4(), // Generate unique transaction ID
            amount: bookingDetails.totalAmount / bookingDetails.seatAvailabilityIds.length // Divide total amount by number of seats
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            withCredentials: true
          }
        );
        return paymentResponse.data.data.payment;
      });

      const payments = await Promise.all(paymentPromises);

      // Create booking for each payment
      const bookingPromises = payments.map(async (payment) => {
        const bookingResponse = await axios.post(
          `http://localhost:3000/api/v1/booking/create/${payment._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            withCredentials: true
          }
        );
        return bookingResponse.data.data.booking;
      });

      const bookings = await Promise.all(bookingPromises);

      // Clear pending seats from sessionStorage since payment was successful
      sessionStorage.removeItem('pendingSeatAvailabilityIds');

      setStatus('completed');
      setShowConfirmation(true);

      // Navigate to booking confirmation page after successful payment
      setTimeout(() => {
        navigate('/bookings', { 
          state: { 
            success: true,
            message: 'Payment successful! Your booking has been confirmed.'
          }
        });
      }, 2000);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'refunded':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isFormValid = () => {
    if (paymentMethod !== 'upi') {
      return formData.cardNumber && formData.expiryDate && formData.cvv;
    }
    return formData.upiId;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="fixed top-20 left-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ArrowLeft size={24} className="dark:text-white" />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Payment</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-gray-100">
            <span>{bookingDetails.movieTitle}</span>
            <span>•</span>
            <span>{bookingDetails.theater}</span>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="sticky top-0 z-20 flex justify-center w-full bg-transparent py-4">
        <div className="rounded-2xl shadow-lg px-6 py-2 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-700 max-w-fit">
          {!sessionExpired && (
            <div className="text-lg font-semibold text-red-600">
              Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          {sessionExpired && (
            <div className="text-lg font-bold text-red-700">
              Booking session expired. Please try again.
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Payment Method</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`w-full flex items-center p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'credit'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${
                    paymentMethod === 'credit' ? 'text-red-500' : 'text-gray-500'
                  }`} />
                  <span className="ml-3 dark:text-white">Credit Card</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('debit')}
                  className={`w-full flex items-center p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'debit'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${
                    paymentMethod === 'debit' ? 'text-red-500' : 'text-gray-500'
                  }`} />
                  <span className="ml-3 dark:text-white">Debit Card</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full flex items-center p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Smartphone className={`w-6 h-6 ${
                    paymentMethod === 'upi' ? 'text-red-500' : 'text-gray-500'
                  }`} />
                  <span className="ml-3 dark:text-white">UPI</span>
                </button>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment} className="mt-6 space-y-4">
                {paymentMethod !== 'upi' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {formErrors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YYYY"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {formErrors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        {formErrors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'upi' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="username@upi"
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {formErrors.upiId && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.upiId}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !isFormValid() || sessionExpired}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay ₹{bookingDetails.totalAmount}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Movie</span>
                    <span className="font-medium dark:text-white">{bookingDetails.movieTitle}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Theater</span>
                    <span className="font-medium dark:text-white">{bookingDetails.theater}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Showtime</span>
                    <span className="font-medium dark:text-white">
                      {showtimeDetails ? 
                        new Date(showtimeDetails.showDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                        'Loading...'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Seats</span>
                    <span className="font-medium dark:text-white">{bookingDetails.seats.join(', ')}</span>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                      <span className="font-medium dark:text-white">₹{bookingDetails.totalAmount}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600 dark:text-gray-300">Convenience Fee</span>
                      <span className="font-medium dark:text-white">₹0</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-lg font-bold">
                      <span className="dark:text-white">Total</span>
                      <span className="dark:text-white">₹{bookingDetails.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Payment Status</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                  <span className="capitalize dark:text-white">{status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white">Payment Successful!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your booking has been confirmed. Check your email for the ticket details.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/bookings')}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  View Bookings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;