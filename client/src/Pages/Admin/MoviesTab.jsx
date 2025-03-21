// // MoviesTab.jsx
// import React, { useState } from 'react';
// import { Plus, Edit2, Trash2 } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// function MoviesTab({ setModalType, setShowModal, setEditingItem }) {
//   const [movies, setMovies] = useState([
//     {
//       id: 1,
//       title: "Inception",
//       poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
//       genre: "Sci-Fi",
//       rating: 8.8,
//       language: "English",
//       ageRestriction: "PG-13",
//       duration: "2h 28min",
//       description: "A thief who steals corporate secrets through dream-sharing technology..."
//     }
//   ]);

//   const handleEdit = (movie) => {
//     setModalType('movie');
//     setEditingItem(movie);
//     setShowModal(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this movie?')) {
//       setMovies(movies.filter(movie => movie.id !== id));
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="space-y-6"
//     >
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h2 className="text-2xl font-bold">Movies</h2>
//         <button 
//           onClick={() => { setModalType('movie'); setShowModal(true); }}
//           className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//         >
//           <Plus size={20} />
//           <span>Add Movie</span>
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {movies.map((movie) => (
//           <div 
//             key={movie.id}
//             className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
//           >
//             <img 
//               src={movie.poster} 
//               alt={movie.title}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4 flex-1 flex flex-col justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold mb-2 truncate">{movie.title}</h3>
//                 <div className="space-y-1 text-gray-600 text-sm">
//                   <p>Genre: {movie.genre}</p>
//                   <p>Language: {movie.language}</p>
//                   <p>Rating: {movie.rating}</p>
//                   <p>Duration: {movie.duration}</p>
//                   <p>Age: {movie.ageRestriction}</p>
//                   <p className="line-clamp-2">{movie.description}</p>
//                 </div>
//               </div>
//               <div className="flex gap-2 mt-4">
//                 <button 
//                   onClick={() => handleEdit(movie)}
//                   className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
//                 >
//                   <Edit2 size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button 
//                   onClick={() => handleDelete(movie.id)}
//                   className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors text-sm"
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// }

// export default MoviesTab;

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
      const token = localStorage.getItem('token'); // Adjust based on your auth setup
      const response = await axios.get('http://localhost:8000/api/v1/movie/getAllMovie', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setMovies(response.data.data || response.data); // Adjust based on your API response structure
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
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
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/v1/movie/delete/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setMovies(movies.filter(movie => movie._id !== movieId));
      } catch (err) {
        setError('Failed to delete movie.');
        console.error('Error deleting movie:', err);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Movies</h2>
        <button 
          onClick={() => { setModalType('movie'); setShowModal(true); }}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <img src={movie.movieImage} alt={movie.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 truncate">{movie.title}</h3>
                  <div className="space-y-1 text-gray-600 text-sm">
                    <p>Genre: {movie.genre}</p>
                    <p>Language: {movie.language}</p>
                    <p>Rating: {movie.rating}</p>
                    <p>Duration: {movie.duration}</p>
                    <p>Age: {movie.ageRestriction}</p>
                    <p className="line-clamp-2">{movie.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(movie)} className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-sm">
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button onClick={() => handleDelete(movie._id)} className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors text-sm">
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