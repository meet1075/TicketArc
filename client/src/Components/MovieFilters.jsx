import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const MovieFilters = () => {
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance'];
  const languages = ['English', 'Hindi', 'Spanish'];
  const showtimes = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center space-x-2 mb-4">
        <SlidersHorizontal size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500">
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="release">Release Date</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre, index) => (
              <button
                key={index}
                className="px-3 py-1 text-sm border rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <div className="flex flex-wrap gap-2">
            {languages.map((language, index) => (
              <button
                key={index}
                className="px-3 py-1 text-sm border rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Showtime</label>
          <div className="flex flex-wrap gap-2">
            {showtimes.map((time, index) => (
              <button
                key={index}
                className="px-3 py-1 text-sm border rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;
