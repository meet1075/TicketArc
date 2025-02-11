import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar } from 'lucide-react';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you would fetch movie details based on the ID
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
    showtimes: ["10:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"]
  };

  const handleBooking = (showtime) => {
    // Add booking logic here
    navigate('/bookings');
  };

  return (
    <div className="pt-16">
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
          <div className="md:col-span-1">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full rounded-lg shadow-lg -mt-32 relative z-10"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">{movie.genre}</span>
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

            <div>
              <h3 className="font-semibold mb-4">Select Showtime</h3>
              <div className="flex flex-wrap gap-3">
                {movie.showtimes.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => handleBooking(time)}
                    className="px-4 py-2 bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;