import React, { useState, useContext, useEffect } from 'react';
import { User, Mail, Edit, Save } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // adjust path if needed

function Profile() {
  const { user, setUser } = useContext(AuthContext); // <-- you'll need to expose setUser (small change, I'll show below)
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    userName: '', // Added username
    email: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch("http://localhost:3000/api/v1/user/update-account",
        { fullName: userData.fullName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      
      // ✅ BONUS: Update AuthContext without refresh
      if (response.status === 200) {
        setUser(prev => ({ ...prev, fullName: userData.fullName }));
        alert("Profile Updated Successfully ✅");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Something went wrong ❌");
    }
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
          <div className="p-8">

            <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">Personal Information</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <User size={18} className="text-gray-500 mr-2" />
                    <span>{userData.fullName}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="flex items-center">
                  <User size={18} className="text-gray-500 mr-2" />
                  <span>{userData.userName}</span> {/* Display username */}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex items-center">
                  <Mail size={18} className="text-gray-500 mr-2" />
                  <span>{userData.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Account Settings</h3>

              <div className="space-y-4">
                <button className="text-red-600 hover:text-red-700 transition-colors">
                  Change Password
                </button>
              </div>

              <div className="mt-6">
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

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
