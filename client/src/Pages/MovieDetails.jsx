import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, ArrowLeft, MapPin } from 'lucide-react';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from your auth context
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTimeSelect = (time) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedTime(time);
    navigate(`/theater-seating/${id}/${selectedCinema.id}/${encodeURIComponent(time)}`);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // ... rest of your existing MovieDetails code ...

  return (
    <div className="pt-16">
      {/* ... existing code ... */}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Login Required</h3>
            <p className="text-gray-600 mb-6">
              Please log in to continue with your booking.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ... rest of your existing JSX ... */}
    </div>
  );
}

export default MovieDetails;