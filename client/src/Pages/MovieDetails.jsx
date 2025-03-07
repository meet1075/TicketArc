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

  // Mock data - in a real app, this would come from your API
  const movie = {
    title: "Inception",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Sci-Fi",
    rating: 8.8,
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    duration: "2h 28min",
    releaseDate: "2010-07-16",
    language: "English",
    certificate: "PG-13"
  };

  const cinemas = [
    {
      id: 1,
      name: "PVR Cinemas",
      location: "City Mall, Downtown",
      showtimes: ["10:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
      price: 12
    },
    {
      id: 2,
      name: "INOX Movies",
      location: "Metro Plaza, Westside",
      showtimes: ["11:00 AM", "3:30 PM", "7:00 PM", "10:30 PM"],
      price: 15
    },
    {
      id: 3,
      name: "Cinepolis",
      location: "Central Square Mall",
      showtimes: ["9:30 AM", "1:00 PM", "4:30 PM", "8:00 PM"],
      price: 10
    }
  ];

  const handleCinemaSelect = (cinema) => {
    setSelectedCinema(cinema);
    setSelectedTime(null);
  };

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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="pt-16">
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="fixed top-20 left-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Movie Banner */}
      <div className="relative h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.poster})`
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="md:col-span-1">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full rounded-lg shadow-lg -mt-32 relative z-10"
            />
          </div>

          {/* Movie Details */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">{movie.genre}</span>
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">{movie.language}</span>
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">{movie.certificate}</span>
              <div className="flex items-center text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1">{movie.rating}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="ml-1">{movie.duration}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{movie.description}</p>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Director</h3>
                <p>{movie.director}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cast</h3>
                <p>{movie.cast.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Release Date</h3>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <p>{movie.releaseDate}</p>
                </div>
              </div>
            </div>

            {/* Cinema Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Cinema</h3>
              <div className="space-y-4">
                {cinemas.map((cinema) => (
                  <div 
                    key={cinema.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCinema?.id === cinema.id 
                        ? 'border-red-500 bg-red-50' 
                        : 'hover:border-red-500'
                    }`}
                    onClick={() => handleCinemaSelect(cinema)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{cinema.name}</h4>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin size={16} className="mr-1" />
                          {cinema.location}
                        </div>
                      </div>
                      {/* <span className="text-lg font-semibold">${cinema.price}</span> */}
                    </div>
                    
                    {selectedCinema?.id === cinema.id && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Select Showtime</p>
                        <div className="flex flex-wrap gap-2">
                          {cinema.showtimes.map((time, index) => (
                            <button
                              key={index}
                              onClick={() => handleTimeSelect(time)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                selectedTime === time
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-100 hover:bg-red-500 hover:text-white'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}

export default MovieDetails;