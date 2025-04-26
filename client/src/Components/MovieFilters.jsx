import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MovieFilters = ({ onFilter, activeFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Adventure', 'Animation', 'Documentary'
  ];
  const languages = [
    'English', 'Spanish', 'French', 'Hindi', 'Mandarin', 'Tamil', 'Telugu', 'Korean', 'Japanese', 'German'
  ];

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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow sticky top-20 transition-colors">
      {/* Mobile Filter Button */}
      <button
        className="md:hidden w-full flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <SlidersHorizontal size={20} className="text-gray-600 dark:text-gray-300" />
          <span className="font-medium">Filters</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="flex items-center space-x-2 mb-4">
          <SlidersHorizontal size={20} className="text-gray-600 dark:text-gray-300" />
          <h3 className="text-lg font-semibold dark:text-white">Filters</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
            <select 
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={activeFilters.sortBy}
              onChange={handleSortChange}
            >
              <option value="">Default</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Genre</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                    activeFilters.genre === genre 
                      ? 'bg-red-500 text-white border-red-500' 
                      : 'dark:text-white dark:border-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500'
                  }`}
                  onClick={() => handleFilterClick('genre', genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <button
                  key={language}
                  className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                    activeFilters.language === language 
                      ? 'bg-red-500 text-white border-red-500' 
                      : 'dark:text-white dark:border-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500'
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

      {/* Mobile Filters */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-4"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                <select 
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={activeFilters.sortBy}
                  onChange={handleSortChange}
                >
                  <option value="">Default</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                        activeFilters.genre === genre 
                          ? 'bg-red-500 text-white border-red-500' 
                          : 'dark:text-white dark:border-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500'
                      }`}
                      onClick={() => handleFilterClick('genre', genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <button
                      key={language}
                      className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                        activeFilters.language === language 
                          ? 'bg-red-500 text-white border-red-500' 
                          : 'dark:text-white dark:border-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500'
                      }`}
                      onClick={() => handleFilterClick('language', language)}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieFilters;