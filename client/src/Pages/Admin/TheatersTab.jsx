import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, MonitorPlay, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

function TheatersTab({ setModalType, setShowModal, setEditingItem, refreshKey }) {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTheaters();
  }, [refreshKey]);

  const fetchTheaters = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3000/api/v1/theater/getAllTheater', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const theaterData = response.data.data.docs || response.data.data;
      const theatersWithScreens = await Promise.all(
        theaterData.map(async (theater) => {
          const screenResponse = await axios.get(
            `http://localhost:3000/api/v1/theater/theaters/allScreen/${theater._id}`,
            { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
          );
          const screens = screenResponse.data.data[0]?.screenDetails || [];
          const screensWithShowtimes = await Promise.all(
            screens.map(async (screen) => {
              const showtimeResponse = await axios.get(
                `http://localhost:3000/api/v1/showtime/getShowtimesforScreen/${screen._id}`,
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
              );
              return { ...screen, showtimes: showtimeResponse.data.data || [] };
            })
          );
          return { ...theater, screens: screensWithShowtimes };
        })
      );
      setTheaters(theatersWithScreens);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch theaters.');
      console.error('Error fetching theaters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (theater) => {
    setModalType('theater');
    setEditingItem(theater);
    setShowModal(true);
  };

  const handleDelete = async (theaterId) => {
    if (window.confirm('Are you sure you want to delete this theater?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`http://localhost:3000/api/v1/theater/deleteTheater/${theaterId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setTheaters(theaters.filter((theater) => theater._id !== theaterId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete theater.');
        console.error('Error deleting theater:', err);
      }
    }
  };

  const handleAddScreen = (theater) => {
    setModalType('screen');
    setEditingItem({ theaterId: theater._id });
    setShowModal(true);
  };

  const handleEditScreen = (screen, theaterId) => {
    setModalType('screen');
    setEditingItem({ ...screen, theaterId });
    setShowModal(true);
  };

  const handleDeleteScreen = async (theaterId, screenId) => {
    if (window.confirm('Are you sure you want to delete this screen?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`http://localhost:3000/api/v1/theater/theaters/deleteScreen/${theaterId}/${screenId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setTheaters(theaters.map((theater) => {
          if (theater._id === theaterId) {
            return { ...theater, screens: theater.screens.filter((screen) => screen._id !== screenId) };
          }
          return theater;
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete screen.');
        console.error('Error deleting screen:', err);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Theaters</h2>
        <button
          onClick={() => {
            setModalType('theater');
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={20} />
          <span>Add Theater</span>
        </button>
      </div>

      {loading ? (
        <p>Loading theaters...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : theaters.length === 0 ? (
        <p>No theaters found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theaters.map((theater) => (
            <div key={theater._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{theater.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {theater.location.city}, {theater.location.state}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm">Screens</h4>
                    <button
                      onClick={() => handleAddScreen(theater)}
                      className="flex items-center space-x-1 text-green-500 hover:text-green-600 text-sm"
                    >
                      <Plus size={16} />
                      <span>Add Screen</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {theater.screens.length > 0 ? (
                      theater.screens.map((screen) => (
                        <div key={screen._id} className="bg-gray-50 p-2 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Screen {screen.screenNumber}</p>
                              <p className="text-gray-600">
                                {screen.screenType} • {screen.totalSeats} seats
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditScreen(screen, theater._id)}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteScreen(theater._id, screen._id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs font-medium">Showtimes:</p>
                            {screen.showtimes.length > 0 ? (
                              screen.showtimes.map((showtime) => (
                                <p key={showtime._id} className="text-xs text-gray-600">
                                  {new Date(showtime.showDateTime).toLocaleString()} - {showtime.status}
                                </p>
                              ))
                            ) : (
                              <p className="text-xs text-gray-600">No showtimes scheduled.</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm">No screens added.</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(theater)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(theater._id)}
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

export default TheatersTab;