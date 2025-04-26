import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { movieTitle, showtime, seats, totalAmount, theater, location: theaterLocation, seatAvailabilityIds } = location.state || {};

  useEffect(() => {
    // Add event listener for page unload
    const handleBeforeUnload = () => {
      releaseSeats();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Release seats when component unmounts (user navigates away)
      releaseSeats();
    };
  }, []);

  const releaseSeats = async () => {
    try {
      // Get pending seatAvailabilityIds from sessionStorage
      const pendingIds = JSON.parse(sessionStorage.getItem('pendingSeatAvailabilityIds') || '[]');
      
      if (pendingIds.length > 0) {
        // Release each seat
        await Promise.all(
          pendingIds.map(id =>
            api.patch(`/seatAvailability/releaseSeat/${id}`)
          )
        );
        
        // Clear the pending seats from sessionStorage
        sessionStorage.removeItem('pendingSeatAvailabilityIds');
      }
    } catch (err) {
      console.error('Failed to release seats:', err);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear pending seats from sessionStorage since payment was successful
      sessionStorage.removeItem('pendingSeatAvailabilityIds');

      // Navigate to success page
      navigate('/payment-success', {
        state: {
          movieTitle,
          showtime,
          seats,
          totalAmount,
          theater,
          location: theaterLocation
        }
      });
    } catch (err) {
      setError('Payment failed. Please try again.');
      // Release seats if payment fails
      await releaseSeats();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    // Release seats when user cancels payment
    await releaseSeats();
    navigate(-1);
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default Payment; 