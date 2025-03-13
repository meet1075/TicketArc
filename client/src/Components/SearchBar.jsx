import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, movies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      // Filter movies based on search term
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(value.toLowerCase()) ||
        movie.genre.toLowerCase().includes(value.toLowerCase()) ||
        movie.language.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (movie) => {
    setSearchTerm(movie.title);
    onSearch(movie.title);
    setShowSuggestions(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for movies..."
          className="w-full pl-10 pr-20 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-base sm:text-lg"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {suggestions.map((movie, index) => (
            <button
              key={movie.id || index}
              onClick={() => handleSuggestionClick(movie)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium">{movie.title}</p>
                <p className="text-sm text-gray-600">{movie.genre} • {movie.language}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;