import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.model.js";
import { SeatAvailability } from "../models/seatAvailability.model.js";
import mongoose from "mongoose";

const createBooking = asyncHandler(async (req, res) => {
  const { showTimeId, movieId, theaterId, screenId, userId, seats, totalAmount } = req.body;
  
  const seatIds = seats.map((seat) => seat.seatId);
  const bookedSeats = await SeatAvailability.find({ _id: { $in: seatIds }, isBooked: true });
  
  if (bookedSeats.length !== 0) {
    throw new ApiErrors(400, "Some seats are already booked.")
  }
  
  const booking = await Booking.create({
    showTimeId,
    movieId,
    theaterId,
    screenId,
    userId,
    seats,
    totalAmount,
    bookingStatus: "Confirmed",
    paymentStatus: "Success"
  });

  await SeatAvailability.updateMany({ _id: { $in: seatIds } }, { $set: { isBooked: true } });

  return res
  .status(201)
  .json(new ApiResponse(201, { booking }, "Booking confirmed successfully."));
});

const getBookingDetails = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId).populate("showTimeId movieId theaterId screenId seats.seatId");
  
  if (!booking) {
    throw new ApiErrors(404, "Booking not found.");

  }

  return res
  .status(200)
  .json(new ApiResponse(200, { booking }, "Booking fetched successfully."));
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);
  
  if (!booking) throw new ApiErrors(404, "Booking not found.");
  if (booking.bookingStatus !== "Confirmed"){
     throw new ApiErrors(400, "Only confirmed bookings can be cancelled.");
  }
  const seatIds = booking.seats.map((seat) => seat.seatId);
  await SeatAvailability.updateMany({ _id: { $in: seatIds } }, { $set: { isBooked: false } });

  booking.bookingStatus = "Cancelled";
  booking.paymentStatus = "Refunded";
  await booking.save();

  return res
  .status(200)
  .json(new ApiResponse(200, { booking }, "Booking cancelled successfully and seats released."));
});

const getAllBookingsOfShowTime = asyncHandler(async (req, res) => {
  const { showTimeId } = req.params;
  const bookings = await Booking.find({ showTimeId }).populate("userId seats.seatId");
  
  return res
  .status(200)
  .json(new ApiResponse(200, { bookings }, "Bookings fetched successfully."));
});

const getAllBookingsOfUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const bookings = await Booking.find({ userId }).populate("showTimeId movieId theaterId screenId seats.seatId");

  return res
  .status(200)
  .json(new ApiResponse(200, { bookings }, "User bookings fetched successfully."));
});

const seatAvailability = asyncHandler(async (req, res) => {
  const { showTimeId } = req.params;
  const bookedSeats = await Booking.find({ showTimeId, bookingStatus: "Confirmed" }).select("seats");
  const bookedSeatIds = bookedSeats.flatMap((booking) => booking.seats.map((seat) => seat.seatId));

  return res
  .status(200)
  .json(new ApiResponse(200, { bookedSeats: bookedSeatIds }, "Seat availability checked successfully."));
});

export {
  createBooking,
  getBookingDetails,
  cancelBooking,
  getAllBookingsOfShowTime,
  getAllBookingsOfUser,
  seatAvailability
};
