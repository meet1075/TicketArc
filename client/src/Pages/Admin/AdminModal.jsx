// // AdminModal.jsx
// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// function AdminModal({ showModal, setShowModal, modalType, editingItem, setEditingItem }) {
//   const [formData, setFormData] = useState({
//     title: '', poster: '', genre: '', rating: '', language: '', ageRestriction: '',
//     duration: '', description: '', director: '', cast: '', releaseDate: '',
//     name: '', location: '', screens: [], facilities: []
//   });

//   useEffect(() => {
//     if (editingItem) {
//       if (modalType === 'movie') {
//         setFormData({
//           ...editingItem,
//           cast: editingItem.cast?.join(', ') || ''
//         });
//       } else {
//         setFormData(editingItem);
//       }
//     }
//   }, [editingItem, modalType]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle submission logic here
//     closeModal();
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditingItem(null);
//     setFormData({
//       title: '', poster: '', genre: '', rating: '', language: '', ageRestriction: '',
//       duration: '', description: '', director: '', cast: '', releaseDate: '',
//       name: '', location: '', screens: [], facilities: []
//     });
//   };

//   return (
//     <AnimatePresence>
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//           >
//             <div className="p-4 sm:p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl sm:text-2xl font-bold">
//                   {editingItem ? `Edit ${modalType === 'movie' ? 'Movie' : 'Theater'}` : `Add New ${modalType === 'movie' ? 'Movie' : 'Theater'}`}
//                 </h2>
//                 <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
//                   <X size={24} />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {modalType === 'movie' ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                       <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
//                       <input type="url" name="poster" value={formData.poster} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
//                       <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
//                       <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} step="0.1" min="0" max="10" required className="w-full p-2 border rounded-md" /></div>
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
//                       <input type="text" name="language" value={formData.language} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Age Restriction</label>
//                       <input type="text" name="ageRestriction" value={formData.ageRestriction} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
//                       <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
//                       <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
//                       <input type="text" name="director" value={formData.director} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Cast (comma-separated)</label>
//                       <input type="text" name="cast" value={formData.cast} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                       <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" className="w-full p-2 border rounded-md" /></div>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Theater Name</label>
//                       <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                       <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
//                   </div>
//                 )}

//                 <div className="flex justify-end space-x-4 pt-4">
//                   <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
//                     Cancel
//                   </button>
//                   <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
//                     {editingItem ? 'Save Changes' : `Add ${modalType === 'movie' ? 'Movie' : 'Theater'}`}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// }

// export default AdminModal;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdminModal({ showModal, setShowModal, modalType, editingItem, setEditingItem }) {
  const [formData, setFormData] = useState({
    title: '', movieImage: null, genre: '', rating: '', language: '', ageRestriction: '',
    duration: '', description: '', director: '', cast: '', releaseDate: '',
    name: '', location: '', screens: [], facilities: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingItem) {
      if (modalType === 'movie') {
        setFormData({
          ...editingItem,
          cast: editingItem.cast?.join(', ') || '',
          movieImage: null // Reset file input
        });
      } else {
        setFormData({
          ...editingItem,
          screens: editingItem.screens || [],
          facilities: editingItem.facilities || []
        });
      }
    }
  }, [editingItem, modalType]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('token');
    const url = editingItem 
      ? `http://localhost:8000/api/v1/${modalType}/update${modalType === 'movie' ? '' : 'Theater'}/${editingItem._id}`
      : `http://localhost:8000/api/v1/${modalType}/add${modalType === 'movie' ? 'Movie' : 'Theater'}`;

    const data = new FormData();
    if (modalType === 'movie') {
      data.append('title', formData.title);
      if (formData.movieImage) data.append('movieImage', formData.movieImage);
      data.append('genre', formData.genre);
      data.append('rating', formData.rating);
      data.append('language', formData.language);
      data.append('ageRestriction', formData.ageRestriction);
      data.append('duration', formData.duration);
      data.append('description', formData.description);
      data.append('director', formData.director);
      data.append('cast', formData.cast.split(',').map(item => item.trim()));
      data.append('releaseDate', formData.releaseDate);
    } else {
      data.append('name', formData.name);
      data.append('location', formData.location);
      // Add screens and facilities as JSON strings if needed
      data.append('screens', JSON.stringify(formData.screens));
      data.append('facilities', JSON.stringify(formData.facilities.split(',').map(item => item.trim())));
    }

    try {
      await axios({
        method: editingItem ? 'patch' : 'post',
        url,
        data,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      closeModal();
    } catch (err) {
      setError(`Failed to ${editingItem ? 'update' : 'add'} ${modalType}.`);
      console.error('Error submitting form:', err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      title: '', movieImage: null, genre: '', rating: '', language: '', ageRestriction: '',
      duration: '', description: '', director: '', cast: '', releaseDate: '',
      name: '', location: '', screens: [], facilities: []
    });
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {editingItem ? `Edit ${modalType === 'movie' ? 'Movie' : 'Theater'}` : `Add New ${modalType === 'movie' ? 'Movie' : 'Theater'}`}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalType === 'movie' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Poster Image</label>
                      <input type="file" name="movieImage" onChange={handleInputChange} accept="image/*" className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                      <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} step="0.1" min="0" max="10" required className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <input type="text" name="language" value={formData.language} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Age Restriction</label>
                      <input type="text" name="ageRestriction" value={formData.ageRestriction} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                      <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
                      <input type="text" name="director" value={formData.director} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Cast (comma-separated)</label>
                      <input type="text" name="cast" value={formData.cast} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" className="w-full p-2 border rounded-md" /></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Theater Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Facilities (comma-separated)</label>
                      <input type="text" name="facilities" value={formData.facilities} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                    {/* Note: Screens might need a separate UI or endpoint call */}
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                    {editingItem ? 'Save Changes' : `Add ${modalType === 'movie' ? 'Movie' : 'Theater'}`}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminModal;