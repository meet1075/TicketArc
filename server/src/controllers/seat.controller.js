// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiErrors } from "../utils/ApiErrors.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { Seat } from "../models/seat.model.js";
// import { Screen } from "../models/screen.model.js";
// import { Theater } from "../models/theater.model.js";
// import mongoose, { isValidObjectId } from 'mongoose';
// import { ShowTime } from "../models/showtime.model.js";
// import { SeatAvailability } from "../models/seatAvailability.model.js";

// const addSeatsForScreen = asyncHandler(async (req, res) => {
//   const { screenId } = req.params;
//   let { totalRows, seatsPerRow, rowNames, seatTypes } = req.body;

//   if (!mongoose.isValidObjectId(screenId)) {
//       throw new ApiErrors(400, "Invalid screenId");
//   }

//   totalRows = totalRows || 10;
//   seatsPerRow = seatsPerRow || 10;

//   if (!rowNames || !Array.isArray(rowNames) || rowNames.length !== totalRows) {
//       rowNames = Array.from({ length: totalRows }, (_, i) => String.fromCharCode(65 + i));
//   }

//   if (!seatTypes || !Array.isArray(seatTypes) || seatTypes.length !== totalRows) {
//       throw new ApiErrors(400, "seatTypes must be an array of length equal to totalRows");
//   }

//   let seats = [];
//   for (let row = 0; row < totalRows; row++) {
//       for (let col = 1; col <= seatsPerRow; col++) {
//           const seatNumber = `${rowNames[row]}${col}`;

//           seats.push({
//               seatNumber,
//               seatType: seatTypes[row],
//               screenId
//           });
//       }
//   }

//   try {
//       const createdSeats = await Seat.insertMany(seats);
//       console.log(`✅ ${totalRows * seatsPerRow} seats created for Screen ${screenId}`);

//       return res.status(201).json({
//           message: `${totalRows * seatsPerRow} seats created for Screen ${screenId}`,
//           seatsCreated: createdSeats.length,
//       });
//   } catch (error) {
//       console.error("Error inserting seats:", error);
//       res.status(500).json({ error: "Failed to create seats" });
//   }
// });

  
// const deleteSeatsForScreen = asyncHandler(async (req, res) => {
//     const { screenId } = req.params;
  
//     if (!isValidObjectId(screenId)) {
//       throw new ApiErrors(400, "Invalid screenId");
//     }
  
//     const deletedSeats = await Seat.deleteMany({ screenId });
  
//     if (deletedSeats.deletedCount === 0) {
//       throw new ApiErrors(404, "No seats found for this screen");
//     }
  
//     return res.status(200).json({
//       message: `All ${deletedSeats.deletedCount} seats deleted for Screen ${screenId}`,
//     });
// });
  
// const updateSeat = asyncHandler(async (req, res) => {
//     const { seatId } = req.params;
//     const { seatType,seatNumber } = req.body;  
//     if (!isValidObjectId(seatId)) {
//       throw new ApiErrors(400, "Invalid seat Id");
//     }
//     const seat = await Seat.findById(seatId);
//     if (!seat) {
//       throw new ApiErrors(404, "Seat not found");   
//     }
//     const updatedSeat=await Seat.findByIdAndUpdate(
//         seatId,
//       {
//         $set: {
//           seatType: seatType??seat.seatType,
//           seatNumber: seatNumber??seat.seatNumber,
//         },
//       },
//       { new: true }
//     );  
//     return res
//     .status(200)
//     .json(new ApiResponse(200, updatedSeat, "Seat updated successfully"));
// })

// const getSeatById = asyncHandler(async (req, res) => {
//     const { seatId } = req.params;
//     if (!isValidObjectId(seatId)) {
//         throw new ApiErrors(400, "Invalid seat Id");
//     }
//     const seat = await Seat.findById(seatId);
//     if (!seat) {
//         throw new ApiErrors(404, "Seat not found");
//     }
//     return res
//     .status(200)
//     .json(new ApiResponse(200, seat, "Seat found successfully"));
// })

// const getSeatsByScreenId = asyncHandler(async (req, res) => {
//     const { screenId } = req.params;
//     if (!isValidObjectId(screenId)) {
//         throw new ApiErrors(400, "Invalid screen Id");
//     }
//     const seats = await Seat.find({ screenId }); // Use find({ screenId }) instead of findById
//     if (!seats || seats.length === 0) {
//         throw new ApiErrors(404, "No seats found for this screen");
//     }
//     return res.status(200).json(new ApiResponse(200, seats, "Seats found successfully"));
// });

// const createSeatAvailabilityForShowtime = asyncHandler(async (req, res) => {
//     const { showtimeId, screenId } = req.params;

//     if (!mongoose.isValidObjectId(showtimeId) || !mongoose.isValidObjectId(screenId)) {
//         throw new ApiErrors(400, "Invalid showtimeId or screenId");
//     }

//     const seats = await Seat.find({ screenId });

//     if (!seats.length) {
//         throw new ApiErrors(404, "No seats found for this screen");
//     }

//     const seatAvailability = seats.map(seat => ({
//         seatId: seat._id,
//         seatNumber: seat.seatNumber, // ✅ Ensure seatNumber is included
//         showtimeId,
//         isAvailable: true
//     }));

//     await SeatAvailability.insertMany(seatAvailability);

//     return res.status(201).json({
//         message: `Seat availability created for Showtime ${showtimeId}`,
//         totalSeats: seatAvailability.length
//     });
// });

// const removeSeatAvailabilityForShowtime = asyncHandler(async (req, res) => {
//     const { showtimeId } = req.params;

//     if (!mongoose.isValidObjectId(showtimeId)) {
//         throw new ApiErrors(400, "Invalid showtimeId");
//     }

//     // Delete all seat availability records for the given showtime
//     const result = await SeatAvailability.deleteMany({ showtimeId });

//     if (result.deletedCount === 0) {
//         throw new ApiErrors(404, "No seat availability found for this showtime");
//     }

//     return res.status(200).json({
//         message: `Deleted ${result.deletedCount} seat availability records for Showtime ${showtimeId}`
//     });
// });

// const checkSeatAvailability = asyncHandler(async (req, res) => {
//   const { seatId, showtimeId } = req.params;

//   if (!mongoose.isValidObjectId(seatId) || !mongoose.isValidObjectId(showtimeId)) {
//       throw new ApiErrors(400, "Invalid seatId or showtimeId");
//   }

//   const seatAvailability = await SeatAvailability.findOne({ seatId, showtimeId });

//   if (!seatAvailability) {
//       throw new ApiErrors(404, "Seat availability not found for this showtime");
//   }

//   return res.status(200).json(new ApiResponse(200, { isAvailable: seatAvailability.isAvailable }, "Seat availability checked successfully"));
// });

// const confirmSeatBooking = asyncHandler(async (req, res) => {
//     const { seatAvailabilityId } = req.params;
//     const userId = req.user?._id; 

//     if (!isValidObjectId(seatAvailabilityId)) {
//         throw new ApiErrors(400, "Invalid seatAvailabilityId");
//     }
//     if (!userId) {
//         throw new ApiErrors(401, "User not authenticated");
//     }

//     // Fetch the seat with `seatNumber` and necessary fields
//     const seat = await SeatAvailability.findById(seatAvailabilityId).select("seatNumber isAvailable isReserved reservedBy reservationExpiry");

//     if (!seat) {throw new ApiErrors(404, "Seat not found");}
//     if (!seat.isAvailable) { throw new ApiErrors(400, "Seat is already booked");}
//     if (seat.isReserved && new Date() < seat.reservationExpiry) {throw new ApiErrors(400, "Seat is already reserved by another user");}

//     // Reserve the seat for this user (expires in 5 mins)
//     const updatedSeat = await SeatAvailability.findByIdAndUpdate(
//         seatAvailabilityId,
//         {
//             isReserved: true,
//             isAvailable: false, // Ensure seat is marked unavailable
//             reservedBy: userId,
//             reservationExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
//         },
//         { new: true, runValidators: true } // Ensures updated document is returned
//     );

//     console.log("Updated Seat After Reservation:", updatedSeat); // ✅ Debugging

//     return res
//     .status(200)
//     .json(new ApiResponse(200, updatedSeat, "Seat reserved successfully for 5 minutes"));
// });


// const cancelSeatBooking = asyncHandler(async (req, res) => {
//     const { seatAvailabilityId } = req.params;
//     const userId = req.user?._id; 
  
//     if (!isValidObjectId(seatAvailabilityId)) {
//         throw new ApiErrors(400, "Invalid seatAvailabilityId");
//     }
//     if (!userId) {
//         throw new ApiErrors(401, "User not authenticated");
//     }
  
//     const seat = await SeatAvailability.findById(seatAvailabilityId);
//     if (!seat) throw new ApiErrors(404, "Seat not found");
//     if (!seat.reservedBy || seat.reservedBy.toString() !== userId.toString()) {
//         throw new ApiErrors(400, "Seat is not reserved by you");
//     }
  
//     // Reset seat reservation
//     seat.reservedBy = null;
//     seat.isReserved = false;
//     seat.isAvailable = true;
//     seat.reservationExpiry = null;  // Fix: Remove expiry to prevent conflicts

//     await seat.save();
  
//     return res.status(200).json(new ApiResponse(200, seat, "Seat booking cancelled successfully"));
// });

// const getSeatLayoutForShowtime = asyncHandler(async (req, res) => {
//     const { screenId, showtimeId } = req.params;
  
//     if (!isValidObjectId(screenId) || !isValidObjectId(showtimeId)) {
//       throw new ApiErrors(400, "Invalid screenId or showtimeId");
//     }
  
//     // Fetch seats for the screen
//     const seats = await Seat.find({ screenId }).select("seatNumber seatType");
  
//     // Fetch seat availability for the showtime
//     const seatAvailabilities = await SeatAvailability.find({ showtimeId }).select("seatNumber isAvailable isReserved reservationExpiry");
  
//     // Combine seat and availability data
//     const seatLayout = seats.map(seat => {
//       const availability = seatAvailabilities.find(avail => avail.seatNumber === seat.seatNumber) || {};
//       return {
//         seatNumber: seat.seatNumber,
//         seatType: seat.seatType,
//         isAvailable: availability.isAvailable ?? true,
//         isReserved: availability.isReserved ?? false,
//         reservationExpiry: availability.reservationExpiry || null,
//       };
//     });
  
//     // Organize seats by rows
//     const rows = [...new Set(seatLayout.map(seat => seat.seatNumber[0]))].sort();
//     const layout = rows.map(row => ({
//       row,
//       seats: seatLayout.filter(seat => seat.seatNumber.startsWith(row)).sort((a, b) => {
//         const numA = parseInt(a.seatNumber.slice(1));
//         const numB = parseInt(b.seatNumber.slice(1));
//         return numA - numB;
//       }),
//       price: seatLayout.find(seat => seat.seatNumber.startsWith(row))?.seatType === "Premium" ? 300 : 250,
//     }));
  
//     return res.status(200).json(new ApiResponse(200, { layout, totalSeats: seatLayout.length }, "Seat layout fetched successfully"));
//   });
// export {
//     addSeatsForScreen,
//     deleteSeatsForScreen,
//     updateSeat,
//     getSeatById,
//     getSeatsByScreenId,
//     createSeatAvailabilityForShowtime,
//     removeSeatAvailabilityForShowtime,
//     checkSeatAvailability,
//     confirmSeatBooking,
//     cancelSeatBooking,
//     getSeatLayoutForShowtime
// }
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Seat } from "../models/seat.model.js";
import { Screen } from "../models/screen.model.js";
import { Theater } from "../models/theater.model.js";
import mongoose, { isValidObjectId } from 'mongoose';
import { ShowTime } from "../models/showtime.model.js";
import { SeatAvailability } from "../models/seatAvailability.model.js";

const addSeatsForScreen = asyncHandler(async (req, res) => {
  const { screenId } = req.params;
  const { rowNames, seatTypes, numberOfColumns, numberOfRows, totalSeats, premiumRows, regularPrice, premiumPrice } = req.body;

  if (!mongoose.isValidObjectId(screenId)) {
    throw new ApiErrors(400, "Invalid screenId");
  }

  // Get the screen details to verify
  const screen = await Screen.findById(screenId);
  if (!screen) {
    throw new ApiErrors(404, "Screen not found");
  }

  if (!rowNames || !Array.isArray(rowNames) || rowNames.length !== numberOfRows) {
    throw new ApiErrors(400, "rowNames must be an array of length equal to numberOfRows");
  }

  if (!seatTypes || !Array.isArray(seatTypes) || seatTypes.length !== numberOfRows) {
    throw new ApiErrors(400, "seatTypes must be an array of length equal to numberOfRows");
  }

  let seats = [];
  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 1; col <= numberOfColumns; col++) {
      const seatNumber = `${rowNames[row]}${col}`;
      const isPremium = seatTypes[row].toLowerCase() === 'premium';
      seats.push({
        seatNumber,
        seatType: seatTypes[row].toLowerCase(),
        screenId,
        price: isPremium ? premiumPrice : regularPrice,
        status: 'available'
      });
    }
  }

  try {
    const createdSeats = await Seat.insertMany(seats);
    console.log(`✅ ${totalSeats} seats created for Screen ${screenId}`);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: `${totalSeats} seats created for Screen ${screenId}`,
      data: {
        seatsCreated: createdSeats.length,
        seats: createdSeats
      }
    });
  } catch (error) {
    console.error("Error inserting seats:", error);
    throw new ApiErrors(500, "Failed to create seats");
  }
});

const deleteSeatsForScreen = asyncHandler(async (req, res) => {
  const { screenId } = req.params;

  if (!isValidObjectId(screenId)) {
    throw new ApiErrors(400, "Invalid screenId");
  }

  const deletedSeats = await Seat.deleteMany({ screenId });

  if (deletedSeats.deletedCount === 0) {
    throw new ApiErrors(404, "No seats found for this screen");
  }

  return res.status(200).json({
    message: `All ${deletedSeats.deletedCount} seats deleted for Screen ${screenId}`,
  });
});

const updateSeat = asyncHandler(async (req, res) => {
  const { seatId } = req.params;
  const { seatType, seatNumber } = req.body;
  if (!isValidObjectId(seatId)) {
    throw new ApiErrors(400, "Invalid seat Id");
  }
  const seat = await Seat.findById(seatId);
  if (!seat) {
    throw new ApiErrors(404, "Seat not found");
  }
  const updatedSeat = await Seat.findByIdAndUpdate(
    seatId,
    {
      $set: {
        seatType: seatType ?? seat.seatType,
        seatNumber: seatNumber ?? seat.seatNumber,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedSeat, "Seat updated successfully"));
});

const getSeatById = asyncHandler(async (req, res) => {
  const { seatId } = req.params;
  if (!isValidObjectId(seatId)) {
    throw new ApiErrors(400, "Invalid seat Id");
  }
  const seat = await Seat.findById(seatId);
  if (!seat) {
    throw new ApiErrors(404, "Seat not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, seat, "Seat found successfully"));
});

const getSeatsByScreenId = asyncHandler(async (req, res) => {
  const { screenId } = req.params;
  if (!isValidObjectId(screenId)) {
    throw new ApiErrors(400, "Invalid screen Id");
  }
  const seats = await Seat.find({ screenId });
  if (!seats || seats.length === 0) {
    throw new ApiErrors(404, "No seats found for this screen");
  }
  return res.status(200).json(new ApiResponse(200, seats, "Seats found successfully"));
});

const getSeatLayoutForShowtime = asyncHandler(async (req, res) => {
    const { screenId, showtimeId } = req.params;
  
    if (!isValidObjectId(screenId) || !isValidObjectId(showtimeId)) {
      throw new ApiErrors(400, "Invalid screenId or showtimeId");
    }
  
    // First, get the screen details to know total seats
    const screen = await Screen.findById(screenId);
    if (!screen) {
      throw new ApiErrors(404, "Screen not found");
    }

    // Fetch the showtime to get seat prices
    const showtime = await ShowTime.findById(showtimeId);
    if (!showtime) {
      throw new ApiErrors(404, "Showtime not found");
    }
    const showtimePrices = showtime.price || { Regular: 0, Premium: 0 };

    // Get the number of rows and columns from the screen model
    const totalRows = screen.numberOfRows || Math.ceil(Math.sqrt(screen.totalSeats));
    const seatsPerRow = screen.numberOfColumns || Math.ceil(screen.totalSeats / totalRows);
    
    // Generate row names (A, B, C, etc.)
    const rowNames = Array.from({ length: totalRows }, (_, i) => String.fromCharCode(65 + i));
  
    // Fetch seats for the screen
    const seats = await Seat.find({ screenId }).select("seatNumber seatType");
  
    // Fetch seat availability for the showtime
    const seatAvailabilities = await SeatAvailability.find({ showtimeId }).select("seatNumber isAvailable isReserved reservationExpiry _id");
  
    // Create a map of existing seats for quick lookup
    const existingSeatsMap = new Map(seats.map(seat => [seat.seatNumber, seat]));
    const availabilityMap = new Map(seatAvailabilities.map(avail => [avail.seatNumber, avail]));

    // Generate complete seat layout including empty seats
    const seatLayout = [];
    for (let row = 0; row < totalRows; row++) {
      const rowSeats = [];
      for (let col = 1; col <= seatsPerRow; col++) {
        const seatNumber = `${rowNames[row]}${col}`;
        const existingSeat = existingSeatsMap.get(seatNumber);
        const availability = availabilityMap.get(seatNumber);
        const seatType = existingSeat?.seatType || "Regular";
        rowSeats.push({
          seatNumber,
          seatType,
          isAvailable: availability?.isAvailable ?? true,
          isReserved: availability?.isReserved ?? false,
          reservationExpiry: availability?.reservationExpiry || null,
          seatAvailabilityId: availability?._id || null,
          price: seatType === "Premium" ? showtimePrices.Premium : showtimePrices.Regular
        });
      }
      seatLayout.push({
        row: rowNames[row],
        seats: rowSeats,
        isPremiumRow: rowSeats[0]?.seatType === "Premium"
      });
    }
  
    return res.status(200).json(new ApiResponse(200, { layout: seatLayout, totalSeats: screen.totalSeats }, "Seat layout fetched successfully"));
});

const createSeatAvailabilityForShowtime = asyncHandler(async (req, res) => {
  const { showtimeId, screenId } = req.params;

  if (!mongoose.isValidObjectId(showtimeId) || !mongoose.isValidObjectId(screenId)) {
    throw new ApiErrors(400, "Invalid showtimeId or screenId");
  }

  const seats = await Seat.find({ screenId });

  if (!seats.length) {
    throw new ApiErrors(404, "No seats found for this screen");
  }

  const seatAvailability = seats.map(seat => ({
    seatId: seat._id,
    seatNumber: seat.seatNumber,
    showtimeId,
    isAvailable: true,
  }));

  await SeatAvailability.insertMany(seatAvailability);

  return res.status(201).json({
    message: `Seat availability created for Showtime ${showtimeId}`,
    totalSeats: seatAvailability.length,
  });
});

const removeSeatAvailabilityForShowtime = asyncHandler(async (req, res) => {
  const { showtimeId } = req.params;

  if (!mongoose.isValidObjectId(showtimeId)) {
    throw new ApiErrors(400, "Invalid showtimeId");
  }

  const result = await SeatAvailability.deleteMany({ showtimeId });

  if (result.deletedCount === 0) {
    throw new ApiErrors(404, "No seat availability found for this showtime");
  }

  return res.status(200).json({
    message: `Deleted ${result.deletedCount} seat availability records for Showtime ${showtimeId}`,
  });
});

const checkSeatAvailability = asyncHandler(async (req, res) => {
  const { seatId, showtimeId } = req.params;

  if (!mongoose.isValidObjectId(seatId) || !mongoose.isValidObjectId(showtimeId)) {
    throw new ApiErrors(400, "Invalid seatId or showtimeId");
  }

  const seatAvailability = await SeatAvailability.findOne({ seatId, showtimeId });

  if (!seatAvailability) {
    throw new ApiErrors(404, "Seat availability not found for this showtime");
  }

  return res.status(200).json(new ApiResponse(200, { isAvailable: seatAvailability.isAvailable }, "Seat availability checked successfully"));
});

const confirmSeatBooking = asyncHandler(async (req, res) => {
  const { seatAvailabilityId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(seatAvailabilityId)) {
    throw new ApiErrors(400, "Invalid seatAvailabilityId");
  }
  if (!userId) {
    throw new ApiErrors(401, "User not authenticated");
  }

  const seat = await SeatAvailability.findById(seatAvailabilityId).select("seatNumber isAvailable isReserved reservedBy reservationExpiry");

  if (!seat) {
    throw new ApiErrors(404, "Seat not found");
  }
  if (!seat.isAvailable) {
    throw new ApiErrors(400, "Seat is already booked");
  }
  if (seat.isReserved && new Date() < seat.reservationExpiry) {
    throw new ApiErrors(400, "Seat is already reserved by another user");
  }

  const updatedSeat = await SeatAvailability.findByIdAndUpdate(
    seatAvailabilityId,
    {
      isReserved: true,
      isAvailable: false,
      reservedBy: userId,
      reservationExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    },
    { new: true, runValidators: true }
  );

  console.log("Updated Seat After Reservation:", updatedSeat);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSeat, "Seat reserved successfully for 5 minutes"));
});

const cancelSeatBooking = asyncHandler(async (req, res) => {
  const { seatAvailabilityId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(seatAvailabilityId)) {
    throw new ApiErrors(400, "Invalid seatAvailabilityId");
  }
  if (!userId) {
    throw new ApiErrors(401, "User not authenticated");
  }

  const seat = await SeatAvailability.findById(seatAvailabilityId);
  if (!seat) throw new ApiErrors(404, "Seat not found");
  if (!seat.reservedBy || seat.reservedBy.toString() !== userId.toString()) {
    throw new ApiErrors(400, "Seat is not reserved by you");
  }

  seat.reservedBy = null;
  seat.isReserved = false;
  seat.isAvailable = true;
  seat.reservationExpiry = null;

  await seat.save();

  return res.status(200).json(new ApiResponse(200, seat, "Seat booking cancelled successfully"));
});

export {
  addSeatsForScreen,
  deleteSeatsForScreen,
  updateSeat,
  getSeatById,
  getSeatsByScreenId,
  createSeatAvailabilityForShowtime,
  removeSeatAvailabilityForShowtime,
  checkSeatAvailability,
  confirmSeatBooking,
  cancelSeatBooking,
  getSeatLayoutForShowtime,
};