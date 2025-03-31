import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

function MoviesTab({ setModalType, setShowModal, setEditingItem, refreshKey }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showtimeModal, setShowtimeModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

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
      setMovies(response.data.data.docs || response.data.data);
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

  const handleAddShowtime = (movie) => {
    setSelectedMovie(movie);
    setShowtimeModal(true);
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
              <img
                src={movie.movieImage}
                alt={movie.title}
                className="w-full h-48 object-cover"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              />
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
                  <button
                    onClick={() => handleAddShowtime(movie)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 transition-colors text-sm"
                  >
                    <Clock size={16} />
                    <span>Showtime</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showtimeModal && (
        <ShowtimeModal
          movie={selectedMovie}
          setShowtimeModal={setShowtimeModal}
          refresh={fetchMovies}
        />
      )}
    </motion.div>
  );
}

function ShowtimeModal({ movie, setShowtimeModal, refresh }) {
  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [formData, setFormData] = useState({
    theaterId: '',
    screenId: '',
    showDateTime: '',
    status: 'Scheduled',
    priceRegular: '',
    pricePremium: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3000/api/v1/theater/getAllTheater', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTheaters(response.data.data.docs || response.data.data);
    } catch (err) {
      setError('Failed to fetch theaters.');
      console.error(err);
    }
  };

  const fetchScreens = async (theaterId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:3000/api/v1/theater/theaters/allScreen/${theaterId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setScreens(response.data.data[0]?.screenDetails || []);
    } catch (err) {
      setError('Failed to fetch screens.');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'theaterId') {
      setScreens([]);
      fetchScreens(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(
        `http://localhost:3000/api/v1/showtime/addShowtime/${movie._id}/${formData.screenId}`,
        {
          showDateTime: formData.showDateTime,
          status: formData.status,
          price: {
            Regular: parseFloat(formData.priceRegular),
            Premium: parseFloat(formData.pricePremium),
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setShowtimeModal(false);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add showtime.');
      console.error('Error adding showtime:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Add Showtime for {movie.title}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theater</label>
            <select
              name="theaterId"
              value={formData.theaterId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Theater</option>
              {theaters.map((theater) => (
                <option key={theater._id} value={theater._id}>
                  {theater.name} ({theater.location.city}, {theater.location.state})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Screen</label>
            <select
              name="screenId"
              value={formData.screenId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
              disabled={!formData.theaterId}
            >
              <option value="">Select Screen</option>
              {screens.map((screen) => (
                <option key={screen._id} value={screen._id}>
                  Screen {screen.screenNumber} ({screen.screenType}, {screen.totalSeats} seats)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Show Date & Time</label>
            <input
              type="datetime-local"
              name="showDateTime"
              value={formData.showDateTime}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (Regular)</label>
            <input
              type="number"
              name="priceRegular"
              value={formData.priceRegular}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (Premium)</label>
            <input
              type="number"
              name="pricePremium"
              value={formData.pricePremium}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              step="0.01"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowtimeModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Showtime
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default MoviesTab;