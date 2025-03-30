import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ id, title, poster, genre, rating, onViewDetails }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 h-full">
      <img
        src={poster}
        alt={title}
        className="w-full h-[300px] object-cover"
        onError={(e) => (e.target.src = 'https://via.placeholder.com/300x450?text=No+Image')}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 text-sm">{genre}</span>
          <div className="flex items-center text-yellow-500">
            <Star size={16} />
            <span className="ml-1">{rating}</span>
          </div>
        </div>
        <button
          onClick={onViewDetails || (() => navigate(`/movie/${id}`))}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default MovieCard;