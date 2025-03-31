import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";
import MovieFilters from "../components/MovieFilters";
import MovieCard from "../components/MovieCard";

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    genre: "",
    language: "",
    sortBy: "",
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/movie/getAllMovie",
          { withCredentials: true } // Still include credentials for logged-in users
        );

        console.log("Movies fetched:", response.data);

        if (response.data && response.data.data && response.data.data.docs) {
          const movieData = response.data.data.docs;
          setMovies(movieData);
          setFilteredMovies(movieData);
        } else {
          console.error("Unexpected API response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error.response || error);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = (query) => {
    const filtered = movies.filter((movie) =>
      [movie.title, Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre, movie.language]
        .some((field) => field.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredMovies(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...movies];

    if (filters.genre) {
      filtered = filtered.filter((movie) =>
        Array.isArray(movie.genre) ? movie.genre.includes(filters.genre) : movie.genre === filters.genre
      );
    }

    if (filters.language) {
      filtered = filtered.filter((movie) => movie.language === filters.language);
    }

    if (filters.sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setActiveFilters(filters);
    setFilteredMovies(filtered);
  };

  return (
    <>
      <HeroSection />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 search-section">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <MovieFilters onFilter={handleFilter} activeFilters={activeFilters} />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    id={movie._id}
                    title={movie.title}
                    poster={movie.movieImage}
                    genre={Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                    rating={movie.rating || "N/A"}
                    onViewDetails={() => navigate(`/movie/${movie._id}`)}
                  />
                ))
              ) : (
                <div className="text-center py-8 col-span-full">
                  <p className="text-gray-500">No movies found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;