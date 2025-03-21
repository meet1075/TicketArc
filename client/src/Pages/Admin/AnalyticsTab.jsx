// AnalyticsTab.jsx
import React from 'react';
import { motion } from 'framer-motion';

function AnalyticsTab() {
  const analytics = {
    totalBookings: 1250,
    revenue: 45000,
    activeTheaters: 2,
    popularMovies: [
      { title: "Inception", bookings: 450 },
      { title: "The Dark Knight", bookings: 380 }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Analytics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium mb-2">Total Bookings</h3>
          <p className="text-2xl md:text-3xl font-bold text-red-500">{analytics.totalBookings}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium mb-2">Revenue</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-500">${analytics.revenue}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium mb-2">Active Theaters</h3>
          <p className="text-2xl md:text-3xl font-bold text-blue-500">{analytics.activeTheaters}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-medium mb-4">Popular Movies</h3>
        <div className="space-y-4">
          {analytics.popularMovies.map((movie, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="truncate">{movie.title}</span>
              <span className="font-medium">{movie.bookings} bookings</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default AnalyticsTab;