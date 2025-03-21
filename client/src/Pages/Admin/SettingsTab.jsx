// SettingsTab.jsx
import React from 'react';
import { motion } from 'framer-motion';

function SettingsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Admin Settings</h2>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-medium mb-4">System Preferences</h3>
        {/* Add your settings controls here */}
        <div className="space-y-4 text-sm">
          <p className="text-gray-600">Settings content coming soon...</p>
        </div>
      </div>
    </motion.div>
  );
}

export default SettingsTab;