import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import MovieFilters from '../components/MovieFilters';
import MovieCard from '../components/MovieCard';

// Extended movie data with more diverse options
const movies = [
  {
    id: 1,
    title: "Inception",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Sci-Fi",
    rating: 8.8,
    language: "English"
  },
  {
    id: 2,
    title: "The Dark Knight",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Action",
    rating: 9.0,
    language: "English"
  },
  {
    id: 3,
    title: "3 Idiots",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Comedy",
    rating: 8.4,
    language: "Hindi"
  },
  {
    id: 4,
    title: "Dangal",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Drama",
    rating: 8.4,
    language: "Hindi"
  },
  {
    id: 5,
    title: "RRR",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Action",
    rating: 8.0,
    language: "Telugu"
  },
  {
    id: 6,
    title: "Bahubali: The Beginning",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Action",
    rating: 8.1,
    language: "Telugu"
  },
  {
    id: 7,
    title: "PK",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Comedy",
    rating: 8.1,
    language: "Hindi"
  },
  {
    id: 8,
    title: "Drishyam",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Thriller",
    rating: 8.2,
    language: "Malayalam"
  },
  {
    id: 9,
    title: "Kabir Singh",
    poster: "https://images.unsplash.com/photo-1559781726-70da1449ce86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Drama",
    rating: 7.1,
    language: "Hindi"
  },
  {
    id: 10,
    title: "KGF: Chapter 1",
    poster: "https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    genre: "Action",
    rating: 8.2,
    language: "Kannada"
  }
];

function Home() {
  const navigate = useNavigate();
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [activeFilters, setActiveFilters] = useState({
    genre: '',
    language: '',
    sortBy: ''
  });

  const handleSearch = (query) => {
    const filtered = movies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.toLowerCase().includes(query.toLowerCase()) ||
      movie.language.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...movies];
    
    if (filters.genre) {
      filtered = filtered.filter(movie => movie.genre === filters.genre);
    }
    
    if (filters.language) {
      filtered = filtered.filter(movie => movie.language === filters.language);
    }
    
    if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setActiveFilters(filters);
    setFilteredMovies(filtered);
  };

  return (
    <>
      <HeroSection />
      
      <main className="container mx-auto px-4 py-8" id="movies-section">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <MovieFilters onFilter={handleFilter} activeFilters={activeFilters} />
          </div>
          
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  poster={movie.poster}
                  genre={movie.genre}
                  rating={movie.rating}
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