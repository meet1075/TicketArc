import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdminModal({ showModal, setShowModal, modalType, editingItem, setEditingItem, refresh }) {
  const [formData, setFormData] = useState({
    title: '',
    movieImage: null,
    genre: '',
    duration: '',
    description: '',
    language: '',
    releaseDate: '',
    name: '',
    location: { city: '', state: '' },
    screens: [],
    facilities: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingItem) {
      if (modalType === 'movie') {
        setFormData({
          title: editingItem.title || '',
          movieImage: null,
          genre: Array.isArray(editingItem.genre) ? editingItem.genre.join(', ') : editingItem.genre || '',
          duration: editingItem.duration || '',
          description: editingItem.description || '',
          language: editingItem.language || '',
          releaseDate: editingItem.releaseDate ? editingItem.releaseDate.split('T')[0] : '',
          name: '',
          location: { city: '', state: '' },
          screens: [],
          facilities: '',
        });
      } else if (modalType === 'theater') {
        setFormData({
          title: '',
          movieImage: null,
          genre: '',
          duration: '',
          description: '',
          language: '',
          releaseDate: '',
          name: editingItem.name || '',
          location: editingItem.location || { city: '', state: '' },
          screens: editingItem.screens || [],
          facilities: Array.isArray(editingItem.facilities) ? editingItem.facilities.join(', ') : editingItem.facilities || '',
        });
      }
    } else {
      setFormData({
        title: '',
        movieImage: null,
        genre: '',
        duration: '',
        description: '',
        language: '',
        releaseDate: '',
        name: '',
        location: { city: '', state: '' },
        screens: [],
        facilities: '',
      });
    }
  }, [editingItem, modalType]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'city' || name === 'state') {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('accessToken');
    const url = editingItem
      ? `http://localhost:3000/api/v1/${modalType === 'movie' ? 'movie/update' : 'theater/updateTheater'}/${editingItem._id}`
      : `http://localhost:3000/api/v1/${modalType === 'movie' ? 'movie/addMovie' : 'theater/addTheater'}`;

    const data = modalType === 'movie' ? new FormData() : {};
    if (modalType === 'movie') {
      data.append('title', formData.title);
      if (formData.movieImage) data.append('movieImage', formData.movieImage);
      data.append('genre', formData.genre.split(',').map((g) => g.trim()));
      data.append('duration', formData.duration);
      data.append('description', formData.description);
      data.append('language', formData.language);
      data.append('releaseDate', formData.releaseDate);
    } else {
      data.name = formData.name;
      data.location = formData.location;
      if (formData.facilities) data.facilities = formData.facilities.split(',').map((f) => f.trim());
    }

    try {
      await axios({
        method: editingItem ? 'patch' : 'post',
        url,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(modalType === 'movie' ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }),
        },
        withCredentials: true,
      });
      setShowModal(false);
      if (refresh) refresh(); // Trigger parent refresh
    } catch (err) {
      setError(`Failed to ${editingItem ? 'update' : 'add'} ${modalType}: ${err.response?.data?.message || err.message}`);
      console.error('Error submitting form:', err.response || err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      title: '',
      movieImage: null,
      genre: '',
      duration: '',
      description: '',
      language: '',
      releaseDate: '',
      name: '',
      location: { city: '', state: '' },
      screens: [],
      facilities: '',
    });
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poster Image</label>
                      <input type="file" name="movieImage" onChange={handleInputChange} accept="image/*" className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Genre (comma-separated)</label>
                      <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <input type="text" name="language" value={formData.language} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                      <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" className="w-full p-2 border rounded-md" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Theater Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input type="text" name="city" value={formData.location.city} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input type="text" name="state" value={formData.location.state} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facilities (comma-separated)</label>
                      <input type="text" name="facilities" value={formData.facilities} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
                    </div>
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