import React, { useState } from 'react';
import { X, Check, ArrowLeft } from 'lucide-react';

const TheaterSeating = ({ onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  
  // Some seats are already booked (this would come from your backend in a real app)
  const bookedSeats = ['A3', 'B5', 'B6', 'C4', 'D7', 'E2', 'F8', 'G1'];

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(seat => seat !== seatId);
      } else if (prev.length < 6) { // Maximum 6 seats per booking
        return [...prev, seatId].sort();
      }
      return prev;
    });
  };

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const getSeatPrice = (row) => {
    // Premium rows (F, G, H) cost more
    return ['F', 'G', 'H'].includes(row) ? 15 : 12;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-center space-x-8 mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-200 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-500 rounded mr-2"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Screen */}
        <div className="w-full h-8 bg-gradient-to-b from-gray-300 to-transparent mb-12 rounded-t-lg">
          <p className="text-center text-sm text-gray-600">SCREEN</p>
        </div>

        {/* Seats */}
        <div className="grid gap-8">
          {rows.map((row) => (
            <div key={row} className="flex items-center">
              <div className="w-8 text-center font-bold">{row}</div>
              <div className="flex-1 grid grid-cols-12 gap-2">
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatId = `${row}${i + 1}`;
                  const status = getSeatStatus(seatId);
                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={status === 'booked'}
                      className={`
                        w-8 h-8 rounded-t-lg flex items-center justify-center text-sm font-medium
                        transition-all duration-200 transform hover:scale-110
                        ${status === 'booked' ? 'bg-gray-500 cursor-not-allowed' : ''}
                        ${status === 'selected' ? 'bg-red-500 text-white' : ''}
                        ${status === 'available' ? 'bg-gray-200 hover:bg-gray-300' : ''}
                      `}
                    >
                      {status === 'selected' && <Check className="w-4 h-4" />}
                      {status === 'booked' && <X className="w-4 h-4" />}
                      {status === 'available' && i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="w-16 text-right text-sm text-gray-600">
                ${getSeatPrice(row)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Seats Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Selected Seats: {selectedSeats.length}</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSeats.map(seat => (
            <span key={seat} className="px-2 py-1 bg-red-100 text-red-600 rounded">
              {seat}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Total Amount:</p>
            <p className="text-2xl font-bold">
              ${selectedSeats.reduce((total, seat) => total + getSeatPrice(seat[0]), 0)}
            </p>
          </div>
          <button
            disabled={selectedSeats.length === 0}
            className="px-6 py-2 bg-red-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
            onClick={() => onSeatSelect(selectedSeats)}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheaterSeating;