import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('pending');
  const [showConfirmation, setShowConfirmation] = useState(false);

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
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setStatus('completed');
      setShowConfirmation(true);
      setLoading(false);
    }, 2000);
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
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">Payment</h1>
          <div className="flex flex-wrap items-center gap-2 text-gray-100">
            <span>{bookingDetails.movieTitle}</span>
            <span>•</span>
            <span>{bookingDetails.theater}</span>
            <span>•</span>
            <span>{bookingDetails.showtime}</span>
          </div>
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
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
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
                      placeholder="username@upi"
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
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
                    <span className="font-medium dark:text-white">{bookingDetails.showtime}</span>
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