import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdminModal({ showModal, setShowModal, modalType, editingItem, setEditingItem, refresh }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    numberOfRows: '',
    numberOfColumns: '',
    premiumRows: [],
    price: '',
    premiumPrice: '',
    regularPrice: '',
    description: '',
    duration: '',
    releaseDate: '',
    genre: '',
    language: '',
    rating: '',
    poster: null,
    trailer: null,
    theaterId: '',
    screenNumber: '',
    screenType: '2D',
    totalSeats: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Predefined options for genres and languages
  const genreOptions = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Adventure', 'Animation', 'Documentary'
  ];
  const languageOptions = [
    'English', 'Spanish', 'French', 'Hindi', 'Mandarin', 'Tamil', 'Telugu', 'Korean', 'Japanese', 'German'
  ];

  useEffect(() => {
    if (editingItem) {
      if (modalType === 'movie') {
        setFormData({
          title: editingItem.title || '',
          movieImage: null,
          genre: Array.isArray(editingItem.genre) ? editingItem.genre[0] || '' : (editingItem.genre ? editingItem.genre.split(',')[0].trim() : ''),
          duration: editingItem.duration || '',
          description: editingItem.description || '',
          language: editingItem.language || '',
          releaseDate: editingItem.releaseDate ? editingItem.releaseDate.split('T')[0] : '',
          name: '',
          location: { city: '', state: '' },
          screens: [],
          facilities: '',
          screenNumber: '',
          screenType: '2D',
          totalSeats: '',
          theaterId: '',
          numberOfRows: '',
          numberOfColumns: '',
          premiumRows: [],
          movieId: '',
          showtime: '',
          price: { Premium: '', Regular: '' },
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
          screenNumber: '',
          screenType: '2D',
          totalSeats: '',
          theaterId: '',
          numberOfRows: '',
          numberOfColumns: '',
          premiumRows: [],
          movieId: '',
          showtime: '',
          price: { Premium: '', Regular: '' },
        });
      } else if (modalType === 'screen') {
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
          screenNumber: editingItem.screenNumber || '',
          screenType: editingItem.screenType || '2D',
          totalSeats: editingItem.totalSeats || '',
          theaterId: editingItem.theaterId || '',
          numberOfRows: editingItem.numberOfRows || '',
          numberOfColumns: editingItem.numberOfColumns || '',
          premiumRows: editingItem.premiumRows || [],
          movieId: '',
          showtime: '',
          price: editingItem.price || { Premium: '', Regular: '' },
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
        screenNumber: '',
        screenType: '2D',
        totalSeats: '',
        theaterId: editingItem?.theaterId || '',
        numberOfRows: '',
        numberOfColumns: '',
        premiumRows: [],
        movieId: '',
        showtime: '',
        price: { Premium: '', Regular: '' },
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
        ...(name === 'numberOfRows' || name === 'numberOfColumns'
          ? {
              totalSeats:
                name === 'numberOfRows'
                  ? value * (prev.numberOfColumns || 0)
                  : (prev.numberOfRows || 0) * value,
            }
          : {}),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let url = '';
      let data = {};

      if (modalType === 'movie') {
        url = editingItem?._id ? `http://localhost:3000/api/v1/movie/update/${editingItem._id}` : 'http://localhost:3000/api/v1/movie/addMovie';
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null) {
            formDataToSend.append(key, formData[key]);
          }
        });
        data = formDataToSend;
      } else if (modalType === 'theater') {
        url = editingItem?._id ? `http://localhost:3000/api/v1/theater/updateTheater/${editingItem._id}` : 'http://localhost:3000/api/v1/theater/addTheater';
        data = {
          name: formData.name,
          location: formData.location,
          capacity: formData.capacity,
        };
      } else if (modalType === 'screen') {
        url = editingItem?._id 
          ? `http://localhost:3000/api/v1/screen/update/${editingItem._id}`
          : `http://localhost:3000/api/v1/theater/theaters/addScreen/${formData.theaterId}`;
        
        // Prepare screen data according to API requirements
        data = {
          screenNumber: parseInt(formData.screenNumber, 10),
          screenType: formData.screenType,
          numberOfRows: parseInt(formData.numberOfRows, 10),
          numberOfColumns: parseInt(formData.numberOfColumns, 10),
          totalSeats: parseInt(formData.numberOfRows, 10) * parseInt(formData.numberOfColumns, 10),
          premiumRows: formData.premiumRows.map(row => parseInt(row)),
          theaterId: formData.theaterId,
        };

        try {
          // Create or update the screen
          const screenResponse = await axios[editingItem?._id ? 'put' : 'post'](url, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });

          // Check if the response is successful
          if (!screenResponse.data || !screenResponse.data.data) {
            throw new Error('Invalid response from server');
          }

          // Get the screen ID from the response
          const screenId = editingItem?._id || screenResponse.data.data._id;
          
          if (!screenId) {
            throw new Error('Failed to get screen ID from response');
          }

          // Create seat types array based on premium rows
          const seatTypes = Array(parseInt(formData.numberOfRows)).fill('regular');
          formData.premiumRows.forEach(rowNum => {
            seatTypes[rowNum - 1] = 'premium';
          });

          // Generate row names (A, B, C, etc.)
          const rowNames = Array.from({ length: parseInt(formData.numberOfRows) }, (_, i) => String.fromCharCode(65 + i));

          // Prepare seat data
          const seatData = {
            screenId: screenId,
            rowNames: rowNames,
            seatTypes: seatTypes,
            numberOfColumns: parseInt(formData.numberOfColumns),
            numberOfRows: parseInt(formData.numberOfRows),
            totalSeats: parseInt(formData.numberOfRows) * parseInt(formData.numberOfColumns),
            premiumRows: formData.premiumRows.map(row => parseInt(row)),
          };

          // Add seats for the screen
          const seatResponse = await axios.post(`http://localhost:3000/api/v1/seat/addSeats/${screenId}`, seatData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });

          // Check if the seat response is successful
          if (!seatResponse.data || !seatResponse.data.data) {
            throw new Error('Failed to add seats: Invalid response from server');
          }

          setShowModal(false);
          if (refresh) refresh();
          return; // Exit early after successful screen and seat creation
        } catch (error) {
          console.error('Error creating screen or adding seats:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to create screen or add seats';
          setError(errorMessage);
          setLoading(false);
          return;
        }
      }

      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        withCredentials: true,
      };

      // For movie, do NOT set Content-Type if sending FormData
      if (modalType === 'movie') {
        const response = await axios[editingItem?._id ? 'put' : 'post'](url, data, axiosConfig);
        setShowModal(false);
        if (refresh) refresh();
        return;
      }
      // For other types, set Content-Type to application/json
      axiosConfig.headers['Content-Type'] = 'application/json';
      const response = await axios[editingItem?._id ? 'put' : 'post'](url, data, axiosConfig);
      setShowModal(false);
      if (refresh) refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
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
      screenNumber: '',
      screenType: '2D',
      totalSeats: '',
      theaterId: '',
      numberOfRows: '',
      numberOfColumns: '',
      premiumRows: [],
      movieId: '',
      showtime: '',
      price: { Premium: '', Regular: '' },
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
                  {modalType === 'movie'
                    ? editingItem ? 'Edit Movie' : 'Add New Movie'
                    : modalType === 'theater'
                    ? editingItem ? 'Edit Theater' : 'Add New Theater'
                    : editingItem?._id ? 'Edit Screen' : 'Add New Screen'}
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
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poster Image</label>
                      <input
                        type="file"
                        name="movieImage"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                      <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      >
                        {formData.genre === '' && <option value="">Select Genre</option>}
                        {genreOptions.map((genre) => (
                          <option key={genre} value={genre}>
                            {genre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      >
                        {formData.language === '' && <option value="">Select Language</option>}
                        {languageOptions.map((language) => (
                          <option key={language} value={language}>
                            {language}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                      <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                ) : modalType === 'theater' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Theater Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.location.state}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facilities (comma-separated)</label>
                      <input
                        type="text"
                        name="facilities"
                        value={formData.facilities}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                ) : modalType === 'screen' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Screen Number</label>
                      <input
                        type="number"
                        name="screenNumber"
                        value={formData.screenNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Screen Type</label>
                      <select
                        name="screenType"
                        value={formData.screenType}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="2D">2D</option>
                        <option value="3D">3D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rows</label>
                      <input
                        type="number"
                        name="numberOfRows"
                        value={formData.numberOfRows || ''}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Columns</label>
                      <input
                        type="number"
                        name="numberOfColumns"
                        value={formData.numberOfColumns || ''}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                      <input
                        type="number"
                        name="totalSeats"
                        value={
                          formData.numberOfRows && formData.numberOfColumns
                            ? formData.numberOfRows * formData.numberOfColumns
                            : ''
                        }
                        readOnly
                        className="w-full p-2 border rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Premium Rows</label>
                      <div className="space-y-2">
                        {formData.numberOfRows > 0 && Array.from({ length: formData.numberOfRows }, (_, i) => (
                          <div key={i} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`premiumRow${i}`}
                              checked={formData.premiumRows.includes(i + 1)}
                              onChange={(e) => {
                                const rowNum = i + 1;
                                setFormData(prev => ({
                                  ...prev,
                                  premiumRows: e.target.checked
                                    ? [...prev.premiumRows, rowNum]
                                    : prev.premiumRows.filter(r => r !== rowNum)
                                }));
                              }}
                              className="mr-2"
                            />
                            <label htmlFor={`premiumRow${i}`} className="text-sm">
                              Row {String.fromCharCode(65 + i)} (Premium)
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    {editingItem?._id ? 'Save Changes' : `Add ${modalType === 'movie' ? 'Movie' : modalType === 'theater' ? 'Theater' : 'Screen'}`}
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