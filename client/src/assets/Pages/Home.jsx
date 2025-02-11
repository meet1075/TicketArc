import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import MovieFilters from '../components/MovieFilters';
import MovieCard from '../components/MovieCard';

// Extended movie data
const movies = [
  {
    id: 1,
    title: "Inception",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Sci-Fi",
    rating: 8.8,
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    showtimes: ["10:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"]
  },
  {
    id: 2,
    title: "The Dark Knight",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Action",
    rating: 9.0,
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    showtimes: ["11:00 AM", "3:30 PM", "7:00 PM", "10:30 PM"]
  },
  {
    id: 3,
    title: "Pulp Fiction",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Crime",
    rating: 8.9,
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    showtimes: ["1:00 PM", "4:30 PM", "8:00 PM"]
  },
  {
    id: 4,
    title: "The Shawshank Redemption",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Drama",
    rating: 9.3,
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    showtimes: ["12:00 PM", "3:00 PM", "6:30 PM", "9:00 PM"]
  },
  {
    id: 5,
    title: "The Godfather",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Crime",
    rating: 9.2,
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    showtimes: ["11:30 AM", "2:45 PM", "6:15 PM", "9:45 PM"]
  },
  {
    id: 6,
    title: "Forrest Gump",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Drama",
    rating: 8.8,
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "8:45 PM"]
  },
  // Adding more movies
  {
    id: 7,
    title: "The Matrix",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Sci-Fi",
    rating: 8.7,
    description: "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
    showtimes: ["11:15 AM", "2:45 PM", "6:30 PM", "9:45 PM"]
  },
  {
    id: 8,
    title: "Jurassic Park",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Adventure",
    rating: 8.1,
    description: "A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
    showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"]
  },
  {
    id: 9,
    title: "The Silence of the Lambs",
    poster: "https://images.unsplash.com/photo-1559781726-70da1449ce86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Thriller",
    rating: 8.6,
    description: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
    showtimes: ["12:15 PM", "3:45 PM", "7:15 PM", "10:00 PM"]
  },
  {
    id: 10,
    title: "Gladiator",
    poster: "https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Action",
    rating: 8.5,
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    showtimes: ["11:45 AM", "3:15 PM", "6:45 PM", "9:30 PM"]
  }
];

function Home() {
  const navigate = useNavigate();
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = movies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...movies];
    
    if (filters.genre) {
      filtered = filtered.filter(movie => movie.genre === filters.genre);
    }
    
    if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredMovies(filtered);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <>
      <HeroSection />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <MovieFilters onFilter={handleFilter} />
          </div>
          
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  {...movie} 
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </div>
            
            {filteredMovies.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No movies found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;