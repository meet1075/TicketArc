// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Plus, Edit2, Trash2, LogOut, X, Building2, Film, Users, BarChart4, Settings2 } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// function AdminHome() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('movies');
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState('movie'); // 'movie' or 'theater'
//   const [editingItem, setEditingItem] = useState(null);

//   // Movies State
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
//       description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
//       director: "Christopher Nolan",
//       cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
//       releaseDate: "2010-07-16"
//     }
//   ]);

//   // Theaters State
//   const [theaters, setTheaters] = useState([
//     {
//       id: 1,
//       name: "PVR Cinemas",
//       location: "City Mall, Downtown",
//       screens: [
//         { id: 1, name: "Screen 1", capacity: 150, type: "IMAX" },
//         { id: 2, name: "Screen 2", capacity: 120, type: "Standard" }
//       ],
//       facilities: ["Parking", "Food Court", "Wheelchair Access"],
//       status: "active"
//     },
//     {
//       id: 2,
//       name: "INOX Movies",
//       location: "Metro Plaza, Westside",
//       screens: [
//         { id: 1, name: "Screen 1", capacity: 180, type: "Dolby Atmos" },
//         { id: 2, name: "Screen 2", capacity: 140, type: "Standard" }
//       ],
//       facilities: ["Parking", "Restaurant", "Gaming Zone"],
//       status: "active"
//     }
//   ]);

//   // Form Data State
//   const [formData, setFormData] = useState({
//     // Movie fields
//     title: '',
//     poster: '',
//     genre: '',
//     rating: '',
//     language: '',
//     ageRestriction: '',
//     duration: '',
//     description: '',
//     director: '',
//     cast: '',
//     releaseDate: '',
//     // Theater fields
//     name: '',
//     location: '',
//     screens: [],
//     facilities: []
//   });

//   // Analytics Data (Mock)
//   const analytics = {
//     totalBookings: 1250,
//     revenue: 45000,
//     activeTheaters: theaters.filter(t => t.status === 'active').length,
//     popularMovies: [
//       { title: "Inception", bookings: 450 },
//       { title: "The Dark Knight", bookings: 380 }
//     ]
//   };

//   useEffect(() => {
//     if (editingItem) {
//       if (modalType === 'movie') {
//         setFormData({
//           ...editingItem,
//           cast: editingItem.cast.join(', ')
//         });
//       } else {
//         setFormData(editingItem);
//       }
//     }
//   }, [editingItem]);

//   const handleLogout = () => {
//     navigate('/');
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (modalType === 'movie') {
//       handleMovieSubmit();
//     } else {
//       handleTheaterSubmit();
//     }
//   };

//   const handleMovieSubmit = () => {
//     const movieData = {
//       ...formData,
//       id: editingItem ? editingItem.id : Date.now(),
//       cast: formData.cast.split(',').map(item => item.trim()),
//       rating: parseFloat(formData.rating)
//     };

//     if (editingItem) {
//       setMovies(movies.map(movie => 
//         movie.id === editingItem.id ? movieData : movie
//       ));
//     } else {
//       setMovies([...movies, movieData]);
//     }

//     closeModal();
//   };

//   const handleTheaterSubmit = () => {
//     const theaterData = {
//       ...formData,
//       id: editingItem ? editingItem.id : Date.now(),
//       status: 'active'
//     };

//     if (editingItem) {
//       setTheaters(theaters.map(theater => 
//         theater.id === editingItem.id ? theaterData : theater
//       ));
//     } else {
//       setTheaters([...theaters, theaterData]);
//     }

//     closeModal();
//   };

//   const handleEdit = (item, type) => {
//     setModalType(type);
//     setEditingItem(item);
//     setShowModal(true);
//   };

//   const handleDelete = (id, type) => {
//     if (type === 'movie') {
//       if (window.confirm('Are you sure you want to delete this movie?')) {
//         setMovies(movies.filter(movie => movie.id !== id));
//       }
//     } else {
//       if (window.confirm('Are you sure you want to delete this theater?')) {
//         setTheaters(theaters.filter(theater => theater.id !== id));
//       }
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditingItem(null);
//     setFormData({
//       title: '',
//       poster: '',
//       genre: '',
//       rating: '',
//       language: '',
//       ageRestriction: '',
//       duration: '',
//       description: '',
//       director: '',
//       cast: '',
//       releaseDate: '',
//       name: '',
//       location: '',
//       screens: [],
//       facilities: []
//     });
//   };

//   const openAddModal = (type) => {
//     setModalType(type);
//     setEditingItem(null);
//     setShowModal(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Admin Header */}
//       <header className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             <h1 className="text-xl font-bold">TicketArc Admin</h1>
//             <button 
//               onClick={handleLogout}
//               className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
//             >
//               <LogOut size={18} />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="pt-20 container mx-auto px-4">
//         {/* Admin Navigation */}
//         <div className="mb-8 flex space-x-4">
//           <button
//             onClick={() => setActiveTab('movies')}
//             className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//               activeTab === 'movies' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             <Film size={20} />
//             <span>Movies</span>
//           </button>
//           <button
//             onClick={() => setActiveTab('theaters')}
//             className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//               activeTab === 'theaters' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             <Building2 size={20} />
//             <span>Theaters</span>
//           </button>
//           <button
//             onClick={() => setActiveTab('analytics')}
//             className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//               activeTab === 'analytics' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             <BarChart4 size={20} />
//             <span>Analytics</span>
//           </button>
//           <button
//             onClick={() => setActiveTab('settings')}
//             className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//               activeTab === 'settings' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             <Settings2 size={20} />
//             <span>Settings</span>
//           </button>
//         </div>

//         {/* Content Sections */}
//         <AnimatePresence mode="wait">
//           {activeTab === 'movies' && (
//             <motion.div
//               key="movies"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-6"
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-bold">Movies</h2>
//                 <button 
//                   onClick={() => openAddModal('movie')}
//                   className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//                 >
//                   <Plus size={20} />
//                   <span>Add Movie</span>
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 gap-6">
//                 {movies.map((movie) => (
//                   <div 
//                     key={movie.id}
//                     className="bg-white rounded-lg shadow-md overflow-hidden flex"
//                   >
//                     <img 
//                       src={movie.poster} 
//                       alt={movie.title}
//                       className="w-48 h-48 object-cover"
//                     />
//                     <div className="flex-1 p-6 flex justify-between">
//                       <div>
//                         <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
//                         <div className="space-y-1 text-gray-600">
//                           <p>Genre: {movie.genre}</p>
//                           <p>Language: {movie.language}</p>
//                           <p>Rating: {movie.rating}</p>
//                           <p>Duration: {movie.duration}</p>
//                           <p>Age Restriction: {movie.ageRestriction}</p>
//                           <p className="line-clamp-2">Description: {movie.description}</p>
//                         </div>
//                       </div>
//                       <div className="flex flex-col space-y-2">
//                         <button 
//                           onClick={() => handleEdit(movie, 'movie')}
//                           className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
//                         >
//                           <Edit2 size={16} />
//                           <span>Edit</span>
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(movie.id, 'movie')}
//                           className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
//                         >
//                           <Trash2 size={16} />
//                           <span>Delete</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {activeTab === 'theaters' && (
//             <motion.div
//               key="theaters"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-6"
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-bold">Theaters</h2>
//                 <button 
//                   onClick={() => openAddModal('theater')}
//                   className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//                 >
//                   <Plus size={20} />
//                   <span>Add Theater</span>
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 gap-6">
//                 {theaters.map((theater) => (
//                   <div 
//                     key={theater.id}
//                     className="bg-white rounded-lg shadow-md p-6"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-xl font-semibold mb-2">{theater.name}</h3>
//                         <p className="text-gray-600 mb-4">{theater.location}</p>
                        
//                         <div className="space-y-4">
//                           <div>
//                             <h4 className="font-medium mb-2">Screens</h4>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                               {theater.screens.map((screen) => (
//                                 <div key={screen.id} className="bg-gray-50 p-2 rounded">
//                                   <p className="font-medium">{screen.name}</p>
//                                   <p className="text-sm text-gray-600">
//                                     {screen.type} • {screen.capacity} seats
//                                   </p>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>

//                           <div>
//                             <h4 className="font-medium mb-2">Facilities</h4>
//                             <div className="flex flex-wrap gap-2">
//                               {theater.facilities.map((facility, index) => (
//                                 <span 
//                                   key={index}
//                                   className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
//                                 >
//                                   {facility}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-col space-y-2">
//                         <button 
//                           onClick={() => handleEdit(theater, 'theater')}
//                           className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
//                         >
//                           <Edit2 size={16} />
//                           <span>Edit</span>
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(theater.id, 'theater')}
//                           className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
//                         >
//                           <Trash2 size={16} />
//                           <span>Delete</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {activeTab === 'analytics' && (
//             <motion.div
//               key="analytics"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-6"
//             >
//               <h2 className="text-2xl font-bold">Analytics</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <h3 className="text-lg font-medium mb-2">Total Bookings</h3>
//                   <p className="text-3xl font-bold text-red-500">{analytics.totalBookings}</p>
//                 </div>
                
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <h3 className="text-lg font-medium mb-2">Revenue</h3>
//                   <p className="text-3xl font-bold text-green-500">${analytics.revenue}</p>
//                 </div>
                
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <h3 className="text-lg font-medium mb-2">Active Theaters</h3>
//                   <p className="text-3xl font-bold text-blue-500">{analytics.activeTheaters}</p>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h3 className="text-lg font-medium mb-4">Popular Movies</h3>
//                 <div className="space-y-4">
//                   {analytics.popularMovies.map((movie, index) => (
//                     <div key={index} className="flex justify-between items-center">
//                       <span>{movie.title}</span>
//                       <span className="font-medium">{movie.bookings} bookings</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {activeTab === 'settings' && (
//             <motion.div
//               key="settings"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-6"
//             >
//               <h2 className="text-2xl font-bold">Admin Settings</h2>
              
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h3 className="text-lg font-medium mb-4">System Preferences</h3>
//                 {/* Add your settings controls here */}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Add/Edit Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//             >
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-bold">
//                     {editingItem ? `Edit ${modalType === 'movie' ? 'Movie' : 'Theater'}` : `Add New ${modalType === 'movie' ? 'Movie' : 'Theater'}`}
//                   </h2>
//                   <button 
//                     onClick={closeModal}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <X size={24} />
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   {modalType === 'movie' ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Title
//                         </label>
//                         <input
//                           type="text"
//                           name="title"
//                           value={formData.title}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Poster URL
//                         </label>
//                         <input
//                           type="url"
//                           name="poster"
//                           value={formData.poster}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Genre
//                         </label>
//                         <input
//                           type="text"
//                           name="genre"
//                           value={formData.genre}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Rating
//                         </label>
//                         <input
//                           type="number"
//                           name="rating"
//                           value={formData.rating}
//                           onChange={handleInputChange}
//                           step="0.1"
//                           min="0"
//                           max="10"
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Language
//                         </label>
//                         <input
//                           type="text"
//                           name="language"
//                           value={formData.language}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Age Restriction
//                         </label>
//                         <input
//                           type="text"
//                           name="ageRestriction"
//                           value={formData.ageRestriction}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Duration
//                         </label>
//                         <input
//                           type="text"
//                           name="duration"
//                           value={formData.duration}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Release Date
//                         </label>
//                         <input
//                           type="date"
//                           name="releaseDate"
//                           value={formData.releaseDate}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Director
//                         </label>
//                         <input
//                           type="text"
//                           name="director"
//                           value={formData.director}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Cast (comma-separated)
//                         </label>
//                         <input
//                           type="text"
//                           name="cast"
//                           value={formData.cast}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Description
//                         </label>
//                         <textarea
//                           name="description"
//                           value={formData.description}
//                           onChange={handleInputChange}
//                           required
//                           rows="4"
//                           className="w-full p-2 border rounded-md"
//                         ></textarea>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Theater Name
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Location
//                         </label>
//                         <input
//                           type="text"
//                           name="location"
//                           value={formData.location}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>

//                       {/* Add more theater-specific fields here */}
//                     </div>
//                   )}

//                   <div className="flex justify-end space-x-4 pt-4">
//                     <button
//                       type="button"
//                       onClick={closeModal}
//                       className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//                     >
//                       {editingItem ? 'Save Changes' : `Add ${modalType === 'movie' ? 'Movie' : 'Theater'}`}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default AdminHome;

// AdminHome.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import MoviesTab from './Admin/MoviesTab';
import TheatersTab from './Admin/TheatersTab';
import AnalyticsTab from './Admin/AnalyticsTab';
import SettingsTab from './Admin/SettingsTab';
import AdminModal from './Admin/AdminModal';
import { Building2, Film, BarChart4, Settings2 } from 'lucide-react';

function AdminHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movies');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('movie');
  const [editingItem, setEditingItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Added refreshKey state

  const handleLogout = () => navigate('/');

  const handleModalClose = () => { // Added handleModalClose function
    setShowModal(false);
    setEditingItem(null);
    setRefreshKey(prev => prev + 1); // Increment to trigger re-fetch
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg md:text-xl font-bold">TicketArc Admin</h1>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="pt-20 container mx-auto px-4">
        <div className="mb-8 flex flex-wrap gap-4">
          {[
            { id: 'movies', Icon: Film, label: 'Movies' },
            { id: 'theaters', Icon: Building2, label: 'Theaters' },
            { id: 'analytics', Icon: BarChart4, label: 'Analytics' },
            { id: 'settings', Icon: Settings2, label: 'Settings' }
          ].map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === id ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Removed duplicate unconditional renders */}
        {activeTab === 'movies' && (
          <MoviesTab 
            refreshKey={refreshKey} 
            setModalType={setModalType} 
            setShowModal={setShowModal} 
            setEditingItem={setEditingItem} 
          />
        )}
        {activeTab === 'theaters' && (
          <TheatersTab 
            refreshKey={refreshKey} 
            setModalType={setModalType} 
            setShowModal={setShowModal} 
            setEditingItem={setEditingItem} 
          />
        )}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'settings' && <SettingsTab />}

        <AdminModal 
          showModal={showModal}
          setShowModal={handleModalClose} // Use the new handler
          modalType={modalType}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />
      </div>
    </div>
  );
}

export default AdminHome;