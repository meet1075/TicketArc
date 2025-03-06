import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, Camera } from 'lucide-react';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Movie Street, Cinema City, CA 90210',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSave = () => {
    // In a real app, you would send this data to your backend
    console.log('Saving user data:', userData);
    setIsEditing(false);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-100">Manage your account information</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Profile Picture Section */}
            <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col items-center justify-start border-r border-gray-200">
              <div className="relative mb-6">
                <img 
                  src={userData.profilePicture} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors">
                    <Camera size={20} />
                  </button>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">{userData.name}</h2>
              <p className="text-gray-600 text-center mb-6">Movie Enthusiast</p>
              
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Edit size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              )}
            </div>
            
            {/* Profile Details Section */}
            <div className="md:w-2/3 p-8">
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">Personal Information</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <User size={18} className="text-gray-500 mr-2" />
                      <span>{userData.name}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Mail size={18} className="text-gray-500 mr-2" />
                      <span>{userData.email}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone size={18} className="text-gray-500 mr-2" />
                      <span>{userData.phone}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    ></textarea>
                  ) : (
                    <div className="flex items-start">
                      <MapPin size={18} className="text-gray-500 mr-2 mt-1" />
                      <span>{userData.address}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                
                <div className="space-y-4">
                  <button className="text-red-600 hover:text-red-700 transition-colors">
                    Change Password
                  </button>
                  <button className="text-red-600 hover:text-red-700 transition-colors">
                    Notification Preferences
                  </button>
                  <button className="text-red-600 hover:text-red-700 transition-colors">
                    Payment Methods
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;