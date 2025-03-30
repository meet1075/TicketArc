import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

function MoviesTab({ setModalType, setShowModal, setEditingItem, refreshKey }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, [refreshKey]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3000/api/v1/movie/getAllMovie', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMovies(response.data.data.docs || response.data.data); // Adjust for pagination
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie) => {
    setModalType('movie');
    setEditingItem(movie);
    setShowModal(true);
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`http://localhost:3000/api/v1/movie/delete/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setMovies(movies.filter((movie) => movie._id !== movieId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete movie.');
        console.error('Error deleting movie:', err);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Movies</h2>
        <button
          onClick={() => {
            setModalType('movie');
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={20} />
          <span>Add Movie</span>
        </button>
      </div>

      {loading ? (
        <p>Loading movies...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <img src={movie.movieImage} alt={movie.title} className="w-full h-48 object-cover" onError={(e) => (e.target.src = 'https://via.placeholder.com/150')} />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 truncate">{movie.title}</h3>
                  <div className="space-y-1 text-gray-600 text-sm">
                    <p>Genre: {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
                    <p>Language: {movie.language}</p>
                    <p>Duration: {movie.duration} mins</p>
                    <p className="line-clamp-2">{movie.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(movie)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(movie._id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default MoviesTab;