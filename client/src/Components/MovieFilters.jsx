import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const MovieFilters = ({ onFilter, activeFilters }) => {
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi'];
  const languages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam', 'Kannada'];

  const handleFilterClick = (type, value) => {
    const newFilters = {
      ...activeFilters,
      [type]: activeFilters[type] === value ? '' : value
    };
    onFilter(newFilters);
  };

  const handleSortChange = (e) => {
    onFilter({
      ...activeFilters,
      sortBy: e.target.value
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow sticky top-20">
      <div className="flex items-center space-x-2 mb-4">
        <SlidersHorizontal size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={activeFilters.sortBy}
            onChange={handleSortChange}
          >
            <option value="">Default</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                  activeFilters.genre === genre 
                    ? 'bg-red-500 text-white border-red-500' 
                    : 'hover:bg-red-500 hover:text-white hover:border-red-500'
                }`}
                onClick={() => handleFilterClick('genre', genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <button
                key={language}
                className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                  activeFilters.language === language 
                    ? 'bg-red-500 text-white border-red-500' 
                    : 'hover:bg-red-500 hover:text-white hover:border-red-500'
                }`}
                onClick={() => handleFilterClick('language', language)}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;