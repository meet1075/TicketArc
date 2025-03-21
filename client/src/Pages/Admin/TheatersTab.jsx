// // TheatersTab.jsx
// import React, { useState } from 'react';
// import { Plus, Edit2, Trash2 } from 'lucide-react';
// import { motion } from 'framer-motion';

// function TheatersTab({ setModalType, setShowModal, setEditingItem }) {
//   const [theaters, setTheaters] = useState([
//     {
//       id: 1,
//       name: "PVR Cinemas",
//       location: "City Mall, Downtown",
//       screens: [
//         { id: 1, name: "Screen 1", capacity: 150, type: "IMAX" },
//         { id: 2, name: "Screen 2", capacity: 120, type: "Standard" }
//       ],
//       facilities: ["Parking", "Food Court", "Wheelchair Access"]
//     }
//   ]);

//   const handleEdit = (theater) => {
//     setModalType('theater');
//     setEditingItem(theater);
//     setShowModal(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this theater?')) {
//       setTheaters(theaters.filter(theater => theater.id !== id));
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
//         <h2 className="text-2xl font-bold">Theaters</h2>
//         <button 
//           onClick={() => { setModalType('theater'); setShowModal(true); }}
//           className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//         >
//           <Plus size={20} />
//           <span>Add Theater</span>
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {theaters.map((theater) => (
//           <div 
//             key={theater.id}
//             className="bg-white rounded-lg shadow-md p-4"
//           >
//             <div className="flex flex-col gap-4">
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">{theater.name}</h3>
//                 <p className="text-gray-600 text-sm">{theater.location}</p>
//               </div>
              
//               <div>
//                 <h4 className="font-medium mb-2 text-sm">Screens</h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                   {theater.screens.map((screen) => (
//                     <div key={screen.id} className="bg-gray-50 p-2 rounded text-sm">
//                       <p className="font-medium">{screen.name}</p>
//                       <p className="text-gray-600">
//                         {screen.type} • {screen.capacity} seats
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h4 className="font-medium mb-2 text-sm">Facilities</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {theater.facilities.map((facility, index) => (
//                     <span 
//                       key={index}
//                       className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
//                     >
//                       {facility}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <button 
//                   onClick={() => handleEdit(theater)}
//                   className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
//                 >
//                   <Edit2 size={16} />
//                   <span>Edit</span>
//                 </button>
//                 <button 
//                   onClick={() => handleDelete(theater.id)}
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

// export default TheatersTab;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';
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
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/v1/theater/getAllTheater', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setTheaters(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch theaters. Please try again.');
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
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/v1/theater/deleteTheater/${theaterId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setTheaters(theaters.filter(theater => theater._id !== theaterId));
      } catch (err) {
        setError('Failed to delete theater.');
        console.error('Error deleting theater:', err);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Theaters</h2>
        <button 
          onClick={() => { setModalType('theater'); setShowModal(true); }}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theaters.map((theater) => (
            <div key={theater._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{theater.name}</h3>
                  <p className="text-gray-600 text-sm">{theater.location}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm">Screens</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {theater.screens?.map((screen) => (
                      <div key={screen._id} className="bg-gray-50 p-2 rounded text-sm">
                        <p className="font-medium">{screen.name}</p>
                        <p className="text-gray-600">{screen.type} • {screen.capacity} seats</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm">Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {theater.facilities?.map((facility, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(theater)} className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors text-sm">
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button onClick={() => handleDelete(theater._id)} className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors text-sm">
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