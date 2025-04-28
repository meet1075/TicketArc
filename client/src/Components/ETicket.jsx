import React from 'react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/image/logo.png';

const formatDateDDMMYYYY = (dateString) => {
  if (!dateString) return 'Invalid Date';
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

const ETicket = ({ booking, onClose, isVisible }) => {
  if (!booking) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full overflow-hidden"
          >
            {/* Ticket Header */}
            <div className="bg-red-500 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-red-100 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo} alt="TicketArc Logo" className="w-8 h-8 object-contain" />
                <h2 className="text-xl font-bold">TicketArc</h2>
              </div>
              <h3 className="text-2xl font-bold mb-2">{booking.movieTitle}</h3>
              <div className="flex items-center text-red-100">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{booking.theater}</span>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-6 space-y-6">
              {/* Show Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span>Date</span>
                  </div>
                  <span className="font-semibold dark:text-white">{formatDateDDMMYYYY(booking.date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Clock className="w-5 h-5" />
                    <span>Time</span>
                  </div>
                  <span className="font-semibold dark:text-white">{booking.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Seats</span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {booking.seats.map((seat) => (
                      <span
                        key={seat}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-sm font-medium"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider with decorative edges */}
              <div className="relative py-4">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded-full"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded-full"></div>
                <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700"></div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Screen</span>
                  <span className="font-mono text-sm font-semibold dark:text-white">{booking.screen}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Amount Paid</span>
                  <span className="font-semibold dark:text-white">₹{booking.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Booking Date</span>
                  <span className="text-sm dark:text-white">{formatDateDDMMYYYY(booking.bookingDate)}</span>
                </div>
              </div>

              {/* Download Button */}
              <button className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                <span>Download Ticket</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ETicket;
