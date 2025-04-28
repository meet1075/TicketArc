import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, Calendar, ArrowLeft, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // Adjust path

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug log: runs on every render
  useEffect(() => {
    const selectedTheater = theaters.find(t => t.id === selectedTheaterId);
    console.log('Theaters:', theaters);
    console.log('SelectedTheaterId:', selectedTheaterId);
    console.log('SelectedTheater:', selectedTheater);
  }, [theaters, selectedTheaterId]);

  // Data fetch: runs only on mount or when id changes
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovieDetails();
    fetchTheatersAndShowtimes();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:3000/api/v1/movie/getMovie/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setMovie(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movie details.');
      console.error('Error fetching movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTheatersAndShowtimes = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      // Fetch all theaters
      const theaterResponse = await axios.get('http://localhost:3000/api/v1/theater/getAllTheater', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      const theaterData = theaterResponse.data.data.docs || theaterResponse.data.data;

      // Fetch showtimes for the movie
      const showtimeResponse = await axios.get(`http://localhost:3000/api/v1/showtime/getShowtimesforMovie/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      const showtimes = Array.isArray(showtimeResponse.data.data) ? showtimeResponse.data.data : [];

      // Map theaters with their showtimes (keep full showtime object)
      const theatersWithShowtimes = theaterData.map((theater) => {
        const theaterShowtimes = showtimes.filter((st) =>
          st.screenId && st.screenId.theaterId && st.screenId.theaterId.toString() === theater._id.toString()
        );
        return {
          id: theater._id,
          name: theater.name,
          location: `${theater.location.city}, ${theater.location.state}`,
          showtimes: theaterShowtimes, // keep full showtime object
        };
      }).filter((t) => t.showtimes.length > 0);

      setTheaters(theatersWithShowtimes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch theaters and showtimes.');
      console.error('Error fetching theaters/showtimes:', err);
    }
  };

  const handleTheaterSelect = (theater) => {
    setSelectedTheaterId(theater.id);
    setSelectedTime(null);
  };

  const handleDateSelect = (date) => {
    console.log('handleDateSelect called with date:', date);
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (showtimeObj) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedTime(showtimeObj._id);
    navigate(`/theater-seating/${id}/${showtimeObj.screenId._id || showtimeObj.screenId}/${showtimeObj._id}`);
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: location.pathname + location.search } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Helper: get unique dates for selected theater's showtimes
  const getAvailableDates = () => {
    if (!selectedTheater) return [];
    const dates = selectedTheater.showtimes.map(st =>
      new Date(st.showDateTime).toLocaleDateString('en-CA')
    );
    const uniqueDates = [...new Set(dates)];
    console.log('Available Dates:', uniqueDates);
    return uniqueDates;
  };

  // Helper: format date as DD/MM/YYYY
  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Helper: get showtimes for selected date
  const getShowtimesForSelectedDate = () => {
    if (!selectedTheater || !selectedDate) return [];
    const filtered = selectedTheater.showtimes.filter(st =>
      new Date(st.showDateTime).toLocaleDateString('en-CA') === selectedDate
    );
    console.log('Selected Date:', selectedDate);
    console.log('Filtered Showtimes:', filtered);
    return filtered;
  };

  // Always get the selectedTheater from the current theaters array
  const selectedTheater = theaters.find(t => t.id === selectedTheaterId);

  console.log('Rendering MovieDetails', { selectedDate, selectedTheater });

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!movie) return <div className="text-center py-20">Movie not found.</div>;

  return (
    <div className="pt-16">
      <button
        onClick={handleBack}
        className="fixed top-20 left-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="relative h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.movieImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={movie.movieImage}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg -mt-32 relative z-10"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/300x450?text=No+Image')}
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
              </span>
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">{movie.language}</span>
            </div>

            <p className="text-gray-600 mb-6">{movie.description}</p>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Release Date</h3>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <p>{new Date(movie.releaseDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Select Theater</h3>
              {theaters.length > 0 ? (
                <div className="space-y-4">
                  {theaters.map((theater) => (
                    <div
                      key={theater.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTheaterId === theater.id ? 'border-red-500 bg-red-50' : 'hover:border-red-500'
                      }`}
                      onClick={() => handleTheaterSelect(theater)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{theater.name}</h4>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin size={16} className="mr-1" />
                            {theater.location}
                          </div>
                        </div>
                      </div>
                      {selectedTheaterId === theater.id && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Select Date</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {getAvailableDates().map(date => (
                              <button
                                key={date}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDateSelect(date);
                                }}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                  selectedDate === date
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 hover:bg-red-500 hover:text-white'
                                }`}
                              >
                                {formatDate(date)}
                              </button>
                            ))}
                          </div>
                          {selectedDate && (
                            <>
                              <p className="text-sm font-medium mb-2">Select Showtime</p>
                              <div className="flex flex-wrap gap-2">
                                {getShowtimesForSelectedDate().length === 0 ? (
                                  <span className="text-gray-500">No showtimes for this date.</span>
                                ) : (
                                  getShowtimesForSelectedDate().map((st) => (
                                    <button
                                      key={st._id}
                                      onClick={() => handleTimeSelect(st)}
                                      className={`px-4 py-2 rounded-lg transition-colors ${
                                        selectedTime === st._id
                                          ? 'bg-red-500 text-white'
                                          : 'bg-gray-100 hover:bg-red-500 hover:text-white'
                                      }`}
                                    >
                                      {new Date(st.showDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </button>
                                  ))
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No showtimes available for this movie.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in to book tickets.
            </p>
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;