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

  // ✅ Validate Payment
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiErrors(404, "Payment not found");
  if (payment.paymentStatus !== "Completed") {
    throw new ApiErrors(400, "Payment is not completed. Cannot confirm booking.");
  }

  // ✅ Fetch Seat Availability & Seat Data
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

  // ✅ Ensure Seat is Still Reserved
  if (!seatAvailability.isReserved || new Date() > seatAvailability.reservationExpiry) {
    throw new ApiErrors(400, "Seat reservation has expired.");
  }

  // ✅ Fetch Correct Showtime Data
  const showtime = seatAvailability.showtimeId;
  if (!showtime || !showtime.price) {
    throw new ApiErrors(400, "Showtime details are incomplete or missing.");
  }

  // ✅ Ensure Screen and Theater Data Exist
  if (!showtime.screenId || !showtime.screenId.theaterId) {
    throw new ApiErrors(400, "Theater information is missing from screen data.");
  }

  // ✅ Determine Correct Seat Type & Pricing
  const correctSeatType = seatAvailability.seatId.seatType; // 🎯 Get seat type
  const seatPrice = showtime.price[correctSeatType] || 0; // 🎯 Get price from Showtime

  if (seatPrice <= 0) throw new ApiErrors(400, "Invalid seat price");

  console.log("🎟️ Seat Type:", correctSeatType);
  console.log("💰 Correct Price:", seatPrice);

  const seats = [{
    seatId: seatAvailability.seatId._id,
    seatNumber: seatAvailability.seatId.seatNumber || "UNKNOWN",
    seatType: correctSeatType, // ✅ Correct seat type
    price: seatPrice, // ✅ Correct price
  }];

  console.log("🎟️ Booking Seats:", seats);

  // ✅ Create Booking
  const booking = await Booking.create({
    showtimeId: showtime._id,
    movieId: showtime.movieId._id,
    theaterId: showtime.screenId.theaterId._id, // ✅ Ensure this exists
    screenId: showtime.screenId._id,
    userId,
    seats,
    totalAmount: seatPrice, // ✅ Ensure totalAmount matches payment amount
    paymentId,
    bookingStatus: "Confirmed",
    paymentStatus: "Success",
  });

  // ✅ Update Seat Status
  await SeatAvailability.updateOne(
    { _id: payment.seatAvailabilityId },
    { $set: { isBooked: true, isReserved: false, reservedBy: null, reservationExpiry: null } }
  );

  // ✅ Attach bookingId to Payment
  payment.bookingId = booking._id;
  await payment.save();

  return res.status(201).json(new ApiResponse(201, { booking }, "Booking confirmed successfully."));
});

const getBookingDetails = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId)
    .populate({
      path: "showtimeId",
      select: "showDateTime", // ✅ Only fetch showtime date & time
    })
    .populate({
      path: "movieId",
      select: "title", // ✅ Only fetch movie title
    })
    .populate({
      path: "screenId",
      select: "screenNumber", // ✅ Only fetch screen number
    })
    .populate({
      path: "seats.seatId",
      select: "seatNumber seatType", // ✅ Only fetch seat details
    })
    .select("seats totalAmount"); // ✅ Limit response to only required fields

  if (!booking) {
    throw new ApiErrors(404, "Booking not found.");
  }

  // ✅ Format the response with only necessary details
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

  // ✅ Find the booking and populate seat data
  const booking = await Booking.findById(bookingId).populate("seats.seatId");

  if (!booking) throw new ApiErrors(404, "Booking not found.");
  if (booking.bookingStatus !== "Confirmed") {
    throw new ApiErrors(400, "Only confirmed bookings can be cancelled.");
  }

  // ✅ Extract valid seat IDs
  const seatIds = booking.seats
    .map((seat) => seat.seatId?._id)
    .filter(Boolean); // Remove null values

  console.log("🪑 Seat IDs to be released:", seatIds);

  if (seatIds.length > 0) {
    // ✅ Ensure seats are properly released
    const updateResult = await SeatAvailability.updateMany(
      { _id: { $in: seatIds } },
      {
        $set: {
          isBooked: false,
          isReserved: false,
          isAvailable: true, // ✅ Ensure availability is updated
          reservedBy: null,
          reservationExpiry: null
        }
      }
    );

    console.log("📌 Seat Update Result:", updateResult);
  }

  // ✅ Update Booking Status
  booking.bookingStatus = "Cancelled";

  // ✅ Adjust `paymentStatus` to a valid enum value
  if (booking.paymentStatus === "Success") {
    booking.paymentStatus = "Pending"; // Change to a valid enum value
  }

  await booking.save();

  return res.status(200).json(new ApiResponse(
    200,
    { booking },
    "Booking cancelled successfully, and seats have been released."
  ));
});
const getAllBookingsOfShowTime = asyncHandler(async (req, res) => {
  const { showTimeId } = req.params;

  // ✅ Fetch necessary details: User's userName & seat numbers
  const bookings = await Booking.find({ showtimeId: showTimeId })
    .populate({
      path: "userId",
      select: "userName _id", // ✅ Fetch userName instead of fullName
    })
    .populate({
      path: "seats.seatId",
      select: "seatNumber", // ✅ Fetch only seat numbers
    });

  // ✅ Transform response to show userName instead of ID
  const formattedBookings = bookings.map((booking) => ({
    user: booking.userId?.userName || `User-${booking.userId?._id.slice(-4)}`, // 🎯 Show userName or anonymized ID
    seats: booking.seats.map((seat) => seat.seatId?.seatNumber || "Unknown"), // 🎯 Handle missing seat numbers
  }));

  return res.status(200).json(
    new ApiResponse(200, { bookings: formattedBookings }, "Bookings fetched successfully.")
  );
});

const getAllBookingsOfUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // ✅ Ensure correct field names (check your schema)
  const bookings = await Booking.find({ userId })
    .populate({
      path: "showtimeId", // ✅ Make sure this exists in the schema
      select: "date time", // ✅ Adjust fields based on your ShowTime model
    })
    .populate({
      path: "movieId",
      select: "title", // ✅ Fetch only movie title
    })
    .populate({
      path: "theaterId",
      select: "name location", // ✅ Fetch theater name & location
    })
    .populate({
      path: "screenId",
      select: "screenNumber", // ✅ Fetch screen number
    })
    .populate({
      path: "seats.seatId",
      select: "seatNumber", // ✅ Fetch seat number
    });

  return res.status(200).json(
    new ApiResponse(200, { bookings }, "User bookings fetched successfully.")
  );
});


const seatAvailability = asyncHandler(async (req, res) => {
  const { showTimeId } = req.params;

  console.log("Checking seat availability for showTimeId:", showTimeId);

  // ✅ Fetch all seats for this showtime
  const allSeats = await SeatAvailability.find({ showTimeId }).select("seatNumber isBooked");

  if (!allSeats.length) {
    console.log("No seats found for this showtime.");
    return res.status(404).json(new ApiResponse(404, { bookedSeats: [], availableSeats: [] }, "No seats found for this showtime."));
  }

  console.log("All Seats in DB:", allSeats);

  // ✅ Separate booked and available seats
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
