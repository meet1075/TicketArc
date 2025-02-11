import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search size={20} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search for movies..."
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
      />
    </div>
  );
};

export default SearchBar;
