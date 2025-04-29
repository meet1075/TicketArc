import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.model.js";
import { SeatAvailability } from "../models/seatAvailability.model.js";
import mongoose from "mongoose";
import { Payment } from "../models/payment.model.js";
import { ShowTime } from "../models/showtime.model.js";

const createBooking = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const userId = req.user?._id;

  if (!userId) throw new ApiErrors(401, "User not authenticated");

  
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiErrors(404, "Payment not found");
  if (payment.paymentStatus !== "Completed") {
    throw new ApiErrors(400, "Payment is not completed. Cannot confirm booking.");
  }

  
  const seatAvailability = await SeatAvailability.findById(payment.seatAvailabilityId)
    .populate({
      path: "seatId",
      select: "seatType seatNumber",
    })
    .populate({
      path: "showtimeId",
      select: "movieId screenId price",
      populate: [
        { path: "movieId", select: "title" }, // Fetch movie title
        { path: "screenId", select: "theaterId", populate: { path: "theaterId", select: "name" } }, // Populate theaterId
      ],
    });

  if (!seatAvailability) throw new ApiErrors(404, "Seat reservation not found");
  if (!seatAvailability.seatId) throw new ApiErrors(404, "Seat data missing");
  if (!seatAvailability.showtimeId) throw new ApiErrors(404, "Showtime not found");

  console.log("📌 Seat Details:", seatAvailability);
  console.log("🔍 isReserved:", seatAvailability.isReserved);
  console.log("⏳ Reservation Expiry:", seatAvailability.reservationExpiry);
  console.log("🕒 Current Time:", new Date());

  
  if (!seatAvailability.isReserved || new Date() > seatAvailability.reservationExpiry) {
    throw new ApiErrors(400, "Seat reservation has expired.");
  }

  
  const showtime = seatAvailability.showtimeId;
  if (!showtime || !showtime.price) {
    throw new ApiErrors(400, "Showtime details are incomplete or missing.");
  }

  
  if (!showtime.screenId || !showtime.screenId.theaterId) {
    throw new ApiErrors(400, "Theater information is missing from screen data.");
  }

  
  const correctSeatType = seatAvailability.seatId.seatType.charAt(0).toUpperCase() + seatAvailability.seatId.seatType.slice(1).toLowerCase();
  
  const seatPrice = payment.amount;

  if (seatPrice <= 0) throw new ApiErrors(400, "Invalid seat price");

  console.log("🎟️ Seat Type:", correctSeatType);
  console.log("💰 Correct Price:", seatPrice);

  const seats = [{
    seatId: seatAvailability.seatId._id,
    seatNumber: seatAvailability.seatId.seatNumber || "UNKNOWN",
    seatType: correctSeatType, // ✅ Correct seat type
    price: seatPrice, 
  }];

  console.log("🎟️ Booking Seats:", seats);

  
  const booking = await Booking.create({
    showtimeId: showtime._id,
    movieId: showtime.movieId._id,
    theaterId: showtime.screenId.theaterId._id, 
    screenId: showtime.screenId._id,
    userId,
    seats,
    totalAmount: seatPrice, 
    paymentId,
    bookingStatus: "Confirmed",
    paymentStatus: "Success",
  });

  
  await SeatAvailability.updateOne(
    { _id: payment.seatAvailabilityId },
    { $set: { isBooked: true, isReserved: false, reservedBy: null, reservationExpiry: null } }
  );

  
  payment.bookingId = booking._id;
  await payment.save();

  return res.status(201).json(new ApiResponse(201, { booking }, "Booking confirmed successfully."));
});

const getBookingDetails = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId)
    .populate({
      path: "showtimeId",
      select: "showDateTime", 
    })
    .populate({
      path: "movieId",
      select: "title",  
    })
    .populate({
      path: "screenId",
      select: "screenNumber", 
    })
    .populate({
      path: "seats.seatId",
      select: "seatNumber seatType",  
    })
    .select("seats totalAmount"); 

  if (!booking) {
    throw new ApiErrors(404, "Booking not found.");
  }

  
  const formattedBooking = {
    showtime: booking.showtimeId?.showDateTime || "N/A",
    movie: booking.movieId?.title || "N/A",
    screenNumber: booking.screenId?.screenNumber || "N/A",
    seats: booking.seats.map(seat => ({
      seatNumber: seat.seatNumber || "N/A",
      seatType: seat.seatType || "N/A",
      price: seat.price || 0,
    })),
    totalAmount: booking.totalAmount || 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { booking: formattedBooking }, "Booking fetched successfully."));
});


const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  
  const booking = await Booking.findById(bookingId).populate("seats.seatId");

  if (!booking) throw new ApiErrors(404, "Booking not found.");
  if (booking.bookingStatus !== "Confirmed") {
    throw new ApiErrors(400, "Only confirmed bookings can be cancelled.");
  }

  
  const seatIds = booking.seats
    .map((seat) => seat.seatId?._id)
    .filter(Boolean); 

  if (seatIds.length > 0) {
    
    await SeatAvailability.updateMany(
      { seatId: { $in: seatIds }, showtimeId: booking.showtimeId },
      {
        $set: {
          isBooked: false,
          isReserved: false,
          isAvailable: true, 
          reservedBy: null,
          reservationExpiry: null
        }
      }
    );
  }

  
  if (booking.paymentId) {
    const payment = await Payment.findById(booking.paymentId);
    if (payment) {
      payment.paymentStatus = "Refunded";
      payment.refundStatus = "Refunded";
      await payment.save();
    }
  }

  
  await Booking.deleteOne({ _id: bookingId });

  return res.status(200).json(new ApiResponse(
    200,
    {},
    "Booking cancelled, deleted, payment refunded, and seats have been released."
  ));
});
const getAllBookingsOfShowTime = asyncHandler(async (req, res) => {
  const { showtimeId } = req.params;

  
  const bookings = await Booking.find({ showtimeId })
    .populate({
      path: "userId",
      select: "userName _id", 
    })
    .populate({
      path: "seats.seatId",
      select: "seatNumber", 
    });

  
  const formattedBookings = bookings.map((booking) => ({
    user: booking.userId?.userName || `User-${booking.userId?._id.slice(-4)}`,
    seats: booking.seats.map((seat) => seat.seatId?.seatNumber || "Unknown"),
  }));

  return res.status(200).json(
    new ApiResponse(200, { bookings: formattedBookings }, "Bookings fetched successfully.")
  );
});

const getAllBookingsOfUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

 
  const bookings = await Booking.find({ userId })
    .populate({
      path: "showtimeId", 
      select: "date time", 
    })
    .populate({
      path: "movieId",
      select: "title", 
    })
    .populate({
      path: "theaterId",
      select: "name location", 
    })
    .populate({
      path: "screenId",
      select: "screenNumber", 
    })
    .populate({
      path: "seats.seatId",
      select: "seatNumber", 
    });

  return res.status(200).json(
    new ApiResponse(200, { bookings }, "User bookings fetched successfully.")
  );
});


const seatAvailability = asyncHandler(async (req, res) => {
  const { showtimeId } = req.params;

  console.log("Checking seat availability for showtimeId:", showtimeId);

  
  const allSeats = await SeatAvailability.find({ showtimeId }).select("seatNumber isBooked");

  if (!allSeats.length) {
    console.log("No seats found for this showtime.");
    return res.status(404).json(new ApiResponse(404, { bookedSeats: [], availableSeats: [] }, "No seats found for this showtime."));
  }

  console.log("All Seats in DB:", allSeats);

  
  const bookedSeats = allSeats.filter(seat => seat.isBooked).map(seat => seat.seatNumber);
  const availableSeats = allSeats.filter(seat => !seat.isBooked).map(seat => seat.seatNumber);

  console.log("Final Booked Seats:", bookedSeats);
  console.log("Final Available Seats:", availableSeats);

  return res.status(200).json(
    new ApiResponse(200, { 
      bookedSeats, 
      availableSeats 
    }, "Seat availability checked successfully.")
  );
});



export {
  createBooking,
  getBookingDetails,
  cancelBooking,
  getAllBookingsOfShowTime,
  getAllBookingsOfUser,
  seatAvailability
};
