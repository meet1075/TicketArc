import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut } from 'lucide-react';

function AdminHome() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Inception",
      poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      genre: "Sci-Fi",
      rating: 8.8,
      language: "English"
    },
    // ... other movies
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  const handleAddMovie = () => {
    // Add movie logic
  };

  const handleEditMovie = (movieId) => {
    // Edit movie logic
  };

  const handleDeleteMovie = (movieId) => {
    // Delete movie logic
    setMovies(movies.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">TicketArc Admin</h1>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="pt-20 container mx-auto px-4">
        {/* Add Movie Button */}
        <div className="mb-8">
          <button 
            onClick={handleAddMovie}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={20} />
            <span>Add New Movie</span>
          </button>
        </div>

        {/* Movie List */}
        <div className="grid grid-cols-1 gap-6">
          {movies.map((movie) => (
            <div 
              key={movie.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex"
            >
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-48 h-48 object-cover"
              />
              <div className="flex-1 p-6 flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Genre: {movie.genre}</p>
                    <p>Language: {movie.language}</p>
                    <p>Rating: {movie.rating}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => handleEditMovie(movie.id)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;