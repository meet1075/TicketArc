import React from 'react';
import { Star, Clock } from 'lucide-react';

const MovieCard = ({ title, poster, genre, rating, showtimes }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      <img src={poster} alt={title} className="w-full h-[400px] object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600">{genre}</span>
          <div className="flex items-center text-yellow-500">
            <Star size={16} />
            <span className="ml-1">{rating}</span>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Clock size={16} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium">Showtimes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {showtimes.map((time, index) => (
              <button
                key={index}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-red-500 hover:text-white rounded transition-colors"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
