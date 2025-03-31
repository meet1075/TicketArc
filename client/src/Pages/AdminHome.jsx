import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // Adjust path
import MoviesTab from './Admin/MoviesTab';
import TheatersTab from './Admin/TheatersTab';
import AnalyticsTab from './Admin/AnalyticsTab';
import SettingsTab from './Admin/SettingsTab';
import AdminModal from './Admin/AdminModal';
import { Building2, Film, BarChart4, Settings2 } from 'lucide-react';

function AdminHome() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movies');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('movie');
  const [editingItem, setEditingItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingItem(null);
    setRefreshKey((prev) => prev + 1); // Trigger refresh of child components
  };

  // Refresh function to pass to AdminModal
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Increment refreshKey to trigger useEffect in child components
  };

  // Redirect non-admins
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

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
            { id: 'settings', Icon: Settings2, label: 'Settings' },
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
        
        {/* Updated AdminModal with refresh prop */}
        {showModal && (
          <AdminModal
            showModal={showModal}
            setShowModal={handleModalClose}
            modalType={modalType}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            refresh={handleRefresh} // Added refresh prop
          />
        )}
      </div>
    </div>
  );
}

export default AdminHome;