import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Check, ArrowLeft, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const TheaterSeating = () => {
  const { movieId, screenId, showtimeId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const [seatLayout, setSeatLayout] = useState([]);
  const [movieDetails, setMovieDetails] = useState({
    title: '',
    cinema: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get JWT token from localStorage or your auth mechanism
  const token = localStorage.getItem('accessToken'); // Use the correct key for your token

  // Axios instance with default headers
  const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1', // Adjust to your backend base URL
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch movie details
        const movieResponse = await api.get(`/movie/getMovie/${movieId}`);
        const movieData = movieResponse.data.data;

        // Fetch showtime details
        const showtimeResponse = await api.get(`/showtime/getShowtime/${showtimeId}`);
        const showtimeData = showtimeResponse.data.data;
        const screenIdFromShowtime = showtimeData.screenId;

        // Fetch screen details
        const screenResponse = await api.get(`/screen/getScreen/${screenIdFromShowtime}`);
        const screenData = screenResponse.data.data;
        const theaterIdFromScreen = screenData.theaterId;

        // Fetch theater details
        const theaterResponse = await api.get(`/theater/getTheater/${theaterIdFromScreen}`);
        const theaterData = theaterResponse.data.data;

        setMovieDetails({
          title: movieData.title,
          cinema: theaterData.name,
          location: `${theaterData.location.city}, ${theaterData.location.state}`,
        });

        // Fetch seat layout for screen and showtime
        const layoutResponse = await api.get(`/seat/layout/${screenId}/${showtimeId}`);
        let layoutData;
        if (layoutResponse.data?.data?.layout && Array.isArray(layoutResponse.data.data.layout)) {
          layoutData = layoutResponse.data.data.layout;
        } else if (layoutResponse.data?.layout && Array.isArray(layoutResponse.data.layout)) {
          layoutData = layoutResponse.data.layout;
        } else {
          if (layoutResponse.data?.data?.layout === undefined || layoutResponse.data?.data?.layout?.length === 0) {
            setError('No seats available for this screen and showtime.');
            setSeatLayout([]);
            return;
          }
          throw new Error('Invalid response structure: layout data missing or not an array');
        }
        setSeatLayout(layoutData);
      } catch (err) {
        console.error('Error fetching seat layout or movie details:', err);
        if (err.response) {
          if (err.response.status === 401) {
            setError('Please log in to view seat layout.');
          } else if (err.response.status === 400) {
            setError('Invalid screen or showtime. Please check your selection.');
          } else if (err.response.status === 404) {
            setError('No seats found for this screen and showtime.');
          } else {
            setError(`Failed to load seat layout: ${err.response.data?.message || 'Unknown error'}`);
          }
        } else {
          setError(err.message || 'Failed to load seat layout. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [screenId, showtimeId, movieId]);

  useEffect(() => {
    setShowMobileBooking(selectedSeats.length > 0);
  }, [selectedSeats]);

  const handleSeatClick = async (seatNumber, seatAvailabilityId) => {
    const seat = seatLayout
      .flatMap(row => row.seats)
      .find(s => s.seatNumber === seatNumber);

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else if (prev.length < 6) {
        return [...prev, seatNumber].sort();
      }
      return prev;
    });
  };

  const handleCancelSeat = async (seatNumber, seatAvailabilityId) => {
    try {
      await api.patch(`/seatAvailability/cancelSeatBooking/${seatAvailabilityId}`);
      setSelectedSeats(prev => prev.filter(seat => seat !== seatNumber));
    } catch (err) {
      console.error('Error canceling seat:', err);
      setError(`Failed to cancel seat reservation: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const getSeatStatus = (seat) => {
    if (!seat?.isAvailable || seat?.isReserved) return 'booked';
    if (selectedSeats.includes(seat?.seatNumber)) return 'selected';
    return 'available';
  };

  const getTotalAmount = () => {
    return selectedSeats.reduce((total, seatNumber) => {
      const row = seatLayout.find(r => r.seats.some(s => s.seatNumber === seatNumber));
      return total + (row ? row.price : 250);
    }, 0);
  };

  const handleProceedToPayment = async () => {
    try {
      // Find seatAvailabilityIds for selected seats
      const seatAvailabilityIds = seatLayout
        .flatMap(row => row.seats)
        .filter(seat => selectedSeats.includes(seat.seatNumber))
        .map(seat => seat.seatAvailabilityId);

      // Call confirmSeatBooking for each selected seat
      await Promise.all(
        seatAvailabilityIds.map(id =>
          api.patch(`/seatAvailability/confirmSeatBooking/${id}`)
        )
      );

      // Store the seatAvailabilityIds in sessionStorage for potential release
      sessionStorage.setItem('pendingSeatAvailabilityIds', JSON.stringify(seatAvailabilityIds));

      // Proceed to payment page
      navigate('/payment', {
        state: {
          movieTitle: movieDetails.title,
          showtime: showtimeId,
          seats: selectedSeats,
          totalAmount: getTotalAmount(),
          theater: movieDetails.cinema,
          location: movieDetails.location,
          seatAvailabilityIds: seatAvailabilityIds, // Pass the IDs to payment page
        },
      });
    } catch (err) {
      setError('Failed to reserve seats. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (seatLayout.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400">
        No seats available for this screen and showtime.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-20 left-4 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={24} className="dark:text-white" />
      </button>

      {/* Header with Movie Details */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-8">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-2 text-center">{movieDetails.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-gray-100 justify-center">
            <span>{movieDetails.cinema}</span>
            <span>•</span>
            <span>{movieDetails.location}</span>
          </div>
        </div>
      </div>

      {/* Seating Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-center flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
                <span className="dark:text-white">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
                <span className="dark:text-white">Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-500 rounded mr-2"></div>
                <span className="dark:text-white">Selected</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            {/* Screen */}
            <div className="w-full h-8 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600 mb-12 rounded-t-lg">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">SCREEN</p>
            </div>

            {/* Seats */}
            <div className="grid gap-6 min-w-[320px]">
              {(() => {
                // Find the maximum number of seats in any row
                const maxSeats = Math.max(...seatLayout.map(row => row.seats.length > 0 ? Math.max(...row.seats.map(seat => parseInt(seat.seatNumber.replace(/\D/g, '')))) : 0));
                return seatLayout.map((row) => {
                  // Create a map for quick lookup
                  const seatMap = {};
                  row.seats.forEach(seat => {
                    // Extract seat number as integer for mapping
                    const seatNum = parseInt(seat.seatNumber.replace(/\D/g, ''));
                    seatMap[seatNum] = seat;
                  });
                  return (
                    <div key={row.row} className="flex items-center gap-2">
                      <div className="w-8 text-center font-bold dark:text-white">{row.row}</div>
                      <div className="flex-1 grid gap-1 md:gap-2" style={{ gridTemplateColumns: `repeat(${maxSeats}, minmax(0, 1fr))` }}>
                        {Array.from({ length: maxSeats }, (_, i) => {
                          const seatNum = i + 1;
                          const seat = seatMap[seatNum];
                          if (seat) {
                            return (
                              <button
                                key={seat.seatNumber}
                                onClick={() =>
                                  selectedSeats.includes(seat.seatNumber)
                                    ? handleCancelSeat(seat.seatNumber, seat.seatAvailabilityId)
                                    : handleSeatClick(seat.seatNumber, seat.seatAvailabilityId)
                                }
                                disabled={
                                  selectedSeats.length >= 6 && !selectedSeats.includes(seat.seatNumber)
                                }
                                className={`
                                  aspect-square min-w-[24px] md:min-w-[32px] rounded-t-lg flex items-center justify-center text-sm font-medium
                                  transition-all duration-200 transform hover:scale-110 touch-manipulation
                                  ${!seat.isAvailable || (seat.isReserved && !selectedSeats.includes(seat.seatNumber)) ? 'bg-red-500 text-white' : ''}
                                  ${selectedSeats.includes(seat.seatNumber) ? 'bg-gray-500 text-white' : ''}
                                  ${seat.isAvailable && (!seat.isReserved || selectedSeats.includes(seat.seatNumber)) && !selectedSeats.includes(seat.seatNumber) ? 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700' : ''}
                                `}
                                aria-label={`Seat ${seat.seatNumber}`}
                              >
                                {selectedSeats.includes(seat.seatNumber) && <Check className="w-3 h-3 md:w-4 md:h-4" />}
                                {seat.isAvailable && (!seat.isReserved || selectedSeats.includes(seat.seatNumber)) && !selectedSeats.includes(seat.seatNumber) && seat.seatNumber.slice(1)}
                              </button>
                            );
                          } else {
                            // Render a placeholder for missing seat
                            return <div key={`empty-${row.row}-${seatNum}`} className="aspect-square min-w-[24px] md:min-w-[32px]" />;
                          }
                        })}
                      </div>
                      <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">
                        ₹{row.price}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Selected Seats Summary - Desktop */}
          <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg hidden md:block">
            <h4 className="font-semibold mb-2 dark:text-white">Selected Seats: {selectedSeats.length}</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSeats.map(seat => (
                <span key={seat} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                  {seat}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Amount:</p>
                <p className="text-2xl font-bold dark:text-white">
                  ₹{getTotalAmount()}
                </p>
              </div>
              <button
                disabled={selectedSeats.length === 0}
                className="px-6 py-3 bg-red-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-colors flex items-center space-x-2"
                onClick={handleProceedToPayment}
              >
                <CreditCard size={20} />
                <span>Proceed to Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Booking Button */}
      <AnimatePresence>
        {showMobileBooking && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg md:hidden"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-xl font-bold dark:text-white">₹{getTotalAmount()}</p>
              </div>
              <button
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                onClick={handleProceedToPayment}
              >
                <CreditCard size={20} />
                <span>Book {selectedSeats.length} Seats</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TheaterSeating;