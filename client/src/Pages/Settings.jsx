import React, { useState ,useEffect } from 'react';
import { ArrowLeft, Moon, Sun, Shield, Bell, Gift, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Switch from 'react-switch';
import { motion } from 'framer-motion';

function Settings() {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [preferredTheaters, setPreferredTheaters] = useState([
    { id: 1, name: 'PVR Cinemas', selected: true },
    { id: 2, name: 'INOX Movies', selected: false },
    { id: 3, name: 'Cinepolis', selected: true }
  ]);

  const [preferredLanguages, setPreferredLanguages] = useState([
    { id: 1, name: 'English', selected: true },
    { id: 2, name: 'Hindi', selected: true },
    { id: 3, name: 'Telugu', selected: false },
    { id: 4, name: 'Tamil', selected: false }
  ]);

  const recentLogins = [
    { device: 'iPhone 13', location: 'Mumbai, India', time: '2 hours ago' },
    { device: 'Chrome on Windows', location: 'Delhi, India', time: '1 day ago' },
    { device: 'Safari on MacBook', location: 'Bangalore, India', time: '3 days ago' }
  ];

  const achievements = [
    { 
      title: 'Movie Buff',
      description: 'Watched 10 movies',
      progress: 7,
      total: 10,
      icon: Star
    },
    {
      title: 'Social Butterfly',
      description: 'Referred 5 friends',
      progress: 3,
      total: 5,
      icon: Users
    },
    {
      title: 'Premium Member',
      description: 'Earned 1000 points',
      progress: 750,
      total: 1000,
      icon: Gift
    }
  ];

  const toggleTheater = (id) => {
    setPreferredTheaters(theaters =>
      theaters.map(theater =>
        theater.id === id ? { ...theater, selected: !theater.selected } : theater
      )
    );
  };

  const toggleLanguage = (id) => {
    setPreferredLanguages(languages =>
      languages.map(language =>
        language.id === id ? { ...language, selected: !language.selected } : language
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-100">Customize your movie experience</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* App Preferences */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-4">App Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {darkMode ? <Moon className="text-gray-600" /> : <Sun className="text-yellow-500" />}
                    <span>Dark Mode</span>
                  </div>
                  <Switch
                    checked={darkMode}
                    onChange={setDarkMode}
                    onColor="#ef4444"
                    offColor="#d1d5db"
                    checkedIcon={false}
                    uncheckedIcon={false}
                    height={24}
                    width={48}
                  />
                </div>
              </div>
            </motion.section>

            {/* Privacy and Security */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="text-gray-600" />
                    <span>Two-Factor Authentication</span>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={setTwoFactorEnabled}
                    onColor="#ef4444"
                    offColor="#d1d5db"
                    checkedIcon={false}
                    uncheckedIcon={false}
                    height={24}
                    width={48}
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Recent Login Activity</h3>
                  <div className="space-y-2">
                    {recentLogins.map((login, index) => (
                      <div key={index} className="text-sm text-gray-600 border-b pb-2">
                        <p className="font-medium">{login.device}</p>
                        <p>{login.location} • {login.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Notifications */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="text-gray-600" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onChange={setNotificationsEnabled}
                    onColor="#ef4444"
                    offColor="#d1d5db"
                    checkedIcon={false}
                    uncheckedIcon={false}
                    height={24}
                    width={48}
                  />
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Booking Preferences */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Booking Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Preferred Theaters</h3>
                  <div className="flex flex-wrap gap-2">
                    {preferredTheaters.map(theater => (
                      <button
                        key={theater.id}
                        onClick={() => toggleTheater(theater.id)}
                        className={`px-4 py-2 rounded-full border transition-colors ${
                          theater.selected
                            ? 'bg-red-500 text-white border-red-500'
                            : 'border-gray-300 hover:border-red-500'
                        }`}
                      >
                        {theater.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Preferred Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {preferredLanguages.map(language => (
                      <button
                        key={language.id}
                        onClick={() => toggleLanguage(language.id)}
                        className={`px-4 py-2 rounded-full border transition-colors ${
                          language.selected
                            ? 'bg-red-500 text-white border-red-500'
                            : 'border-gray-300 hover:border-red-500'
                        }`}
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Achievements and Rewards */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Achievements & Rewards</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Loyalty Points</h3>
                    <span className="text-2xl font-bold text-red-500">750</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">250 points until next reward</p>
                </div>

                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <achievement.icon className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>{achievement.progress} / {achievement.total}</span>
                              <span>{Math.round((achievement.progress / achievement.total) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500 rounded-full transition-all duration-300"
                                style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Referral Program</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Share your referral code with friends and earn rewards when they make their first booking!
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value="MOVIEBUFF2025"
                      readOnly
                      className="flex-1 px-4 py-2 border rounded-lg bg-gray-50"
                    />
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;