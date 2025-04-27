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
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      // Map theaters with their showtimes
      const theatersWithShowtimes = theaterData.map((theater) => {
        const theaterShowtimes = showtimes.filter((st) => 
          st.screenId && st.screenId.theaterId && st.screenId.theaterId.toString() === theater._id.toString()
        );
        return {
          id: theater._id,
          name: theater.name,
          location: `${theater.location.city}, ${theater.location.state}`,
          showtimes: theaterShowtimes.map((st) => ({
            time: new Date(st.showDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            showtimeId: st._id,
            price: st.price?.Regular || 10, // Default price if not set
            screenId: st.screenId?._id || st.screenId, // Ensure screenId is included
          })),
        };
      }).filter((t) => t.showtimes.length > 0);

      setTheaters(theatersWithShowtimes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch theaters and showtimes.');
      console.error('Error fetching theaters/showtimes:', err);
    }
  };

  const handleTheaterSelect = (theater) => {
    setSelectedTheater(theater);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time, showtimeId, screenId) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedTime(time);
    navigate(`/theater-seating/${id}/${screenId}/${showtimeId}`);
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: location.pathname + location.search } });
  };

  const handleBack = () => {
    navigate(-1);
  };

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
              <div className="flex items-center text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1">{movie.rating || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="ml-1">{movie.duration} mins</span>
              </div>
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
                        selectedTheater?.id === theater.id ? 'border-red-500 bg-red-50' : 'hover:border-red-500'
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
                      {selectedTheater?.id === theater.id && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Select Showtime</p>
                          <div className="flex flex-wrap gap-2">
                            {theater.showtimes.map((st) => (
                              <button
                                key={st.showtimeId}
                                onClick={() => handleTimeSelect(st.time, st.showtimeId, st.screenId)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                  selectedTime === st.time
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 hover:bg-red-500 hover:text-white'
                                }`}
                              >
                                {st.time} (${st.price})
                              </button>
                            ))}
                          </div>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Login Required</h3>
            <p className="text-gray-600 mb-6">Please log in to continue with your booking.</p>
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