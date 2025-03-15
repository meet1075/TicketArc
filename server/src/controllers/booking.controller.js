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
  const userId = req.user._id;

  if (!userId) throw new ApiErrors(401, "User not authenticated");

  // Validate payment
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiErrors(404, "Payment not found");
  if (payment.paymentStatus !== "Completed") {
      throw new ApiErrors(400, "Payment is not completed. Cannot confirm booking.");
  }

  // Fetch seat details
  const seat = await SeatAvailability.findById(payment.seatAvailabilityId)
      .select("seatNumber isVIP showtimeId") // ✅ Ensure seatNumber is retrieved
      .populate({
          path: "showtimeId",
          populate: [{ path: "movieId" }, { path: "screenId" }]
      });

  if (!seat) throw new ApiErrors(404, "Seat reservation not found");
  if (!seat.isReserved) throw new ApiErrors(400, "Seat is no longer reserved");

  console.log("Seat Details:", seat);

  const showtime = seat.showtimeId;
  if (!showtime || !showtime.movieId || !showtime.screenId) {
      throw new ApiErrors(400, "Showtime details are incomplete.");
  }

  const seats = [{
      seatId: seat._id,
      seatNumber: seat.seatNumber || "UNKNOWN", // ✅ Prevent `N/A` issue
      seatType: seat.isVIP ? "Premium" : "Regular",
      price: seat.isVIP ? showtime.price.Premium : showtime.price.Regular,
  }];

  console.log("Booking Seats:", seats);

  // Create booking
  const booking = await Booking.create({
      showtimeId: showtime._id,
      movieId: showtime.movieId._id,
      theaterId: showtime.screenId.theaterId,
      screenId: showtime.screenId._id,
      userId,
      seats,
      totalAmount: payment.amount,
      paymentId,
      bookingStatus: "Confirmed",
      paymentStatus: "Success",
  });

  // Update seat status
  await SeatAvailability.updateOne(
      { _id: payment.seatAvailabilityId },
      { $set: { isBooked: true, isReserved: false, reservedBy: null } }
  );

  // Attach bookingId to payment
  payment.bookingId = booking._id;
  await payment.save();

  return res.status(201).json(new ApiResponse(201, { booking }, "Booking confirmed successfully."));
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
