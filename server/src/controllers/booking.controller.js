import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/booking.model.js";
import { ShowTime } from "../models/showtime.model.js";
import { Seat } from "../models/seat.model.js";
import { User } from "../models/user.model.js";
import { Theater } from "../models/theater.model.js";
import { Movie } from "../models/movie.model.js";
import { Screen } from "../models/screen.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";  
import mongoose,{isValidObjectId} from "mongoose";

const createBooking = asyncHandler(async (req, res) => {
    const { showTimeId } = req.params;
  
    if (!isValidObjectId(showTimeId)) {
      throw new ApiErrors(400, "Invalid showTimeId");
    }
  
    const { seats } = req.body;
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      throw new ApiErrors(400, "Seats are required");
    }
  
    // Get showTime details
    const showTime = await ShowTime.findById(showTimeId);
    if (!showTime) {
      throw new ApiErrors(404, "No showtime found");
    }
    if (showTime.status !== "Scheduled") {
      throw new ApiErrors(400, "Showtime is not scheduled");
    }
    if (seats.length > showTime.bookingLimit) {
      throw new ApiErrors(400, `You can book maximum ${showTime.bookingLimit} seats`);
    }
  
    // Find already booked seats for this showtime
    const bookedSeats = await Booking.find({ showTimeId: showTimeId });
    const bookedSeatIds = bookedSeats.map((booking) =>
      booking.seats.map((s) => s.seatId.toString())
    ).flat();
  
    // Get all seat details for requested seat IDs
    const seatDocs = await Seat.find({ _id: { $in: seats } });
    const availableSeatIds = seatDocs
      .filter(seat => !bookedSeatIds.includes(seat._id.toString()))
      .map(seat => seat._id.toString());
  
    // Check for invalid or already booked seats
    const invalidSeats = seats.filter(seatId => !availableSeatIds.includes(seatId));
    if (invalidSeats.length > 0) {
      throw new ApiErrors(400, `Seats ${invalidSeats.join(", ")} are not available`);
    }
  
    // Construct seat details array for booking
    let totalAmount = 0;
    const seatDetails = seatDocs.map(seat => {
      // Determine price based on seat type. Assuming showTime.seatPricing exists.
      const price = showTime.seatPricing[seat.seatType] || 0;
      totalAmount += price;
      return {
        seatId: seat._id,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        price
      };
    });
  
    // Create the booking document
    const booking = await Booking.create({
      showTimeId,
      userId: req.user._id,
      seats: seatDetails,
      totalAmount,
      bookingStatus: "Pending",
      movieId: showTime.movieId,
      theaterId: showTime.theaterId,
      screenId: showTime.screenId
    });
  
    return res
      .status(201)
      .json(new ApiResponse(201, { booking }, "Booking created successfully"));
});

const getBookingDetails = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
  
    if (!isValidObjectId(bookingId)) {
      throw new ApiErrors(400, "Invalid bookingId");
    }
  
    const booking = await Booking.findById(bookingId)
      .populate("movieId", "title duration genre") 
      .populate("theaterId", "name location") 
      .populate("screenId", "screenNumber seatCapacity")
      .populate("userId", "name email") 
      .populate({
        path: "seats.seatId",
        select: "seatNumber seatType price"
      });

    if (!booking) {
      throw new ApiErrors(404, "No booking found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, { booking }, "Booking fetched successfully"));
});


const geAllBookingOfShowTime = asyncHandler(async (req, res) => {
    const { showTimeId } = req.params;
  
    if (!isValidObjectId(showTimeId)) {
      throw new ApiErrors(400, "Invalid showTimeId");
    }
  
    const showTime = await ShowTime.findById(showTimeId);
    if (!showTime) {
      throw new ApiErrors(404, "No showtime found");
    }
  
    const bookings = await Booking.find({ showTimeId });
    return res
      .status(200)
      .json(new ApiResponse(200, { bookings }, "Bookings fetched successfully"));
})

const getBookingByScreen = asyncHandler(async (req, res) => {
    const { screenId } = req.params;
  
    if (!isValidObjectId(screenId)) {
      throw new ApiErrors(400, "Invalid screenId");
    }
  
    const screen = await Screen.findById(screenId);
    if (!screen) {
      throw new ApiErrors(404, "No screen found");
    }
  
    const bookings = await Booking.find({ screenId });
    return res
      .status(200)
      .json(new ApiResponse(200, { bookings }, "Bookings fetched successfully"));
})

const geAllBookingOfTheater = asyncHandler(async (req, res) => {
    const { theaterId } = req.params;
  
    if (!isValidObjectId(theaterId)) {
      throw new ApiErrors(400, "Invalid theaterId");
    }
  
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      throw new ApiErrors(404, "No theater found");
    }
  
    const bookings = await Booking.find({ theaterId });
    return res
      .status(200)
      .json(new ApiResponse(200, { bookings }, "Bookings fetched successfully"));
})

const getBookingByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    if (!isValidObjectId(userId)) {
      throw new ApiErrors(400, "Invalid userId");
    }
  
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiErrors(404, "No user found");
    }
  
    const bookings = await Booking.find({ userId });
    return res
      .status(200)
      .json(new ApiResponse(200, { bookings }, "Bookings fetched successfully"));
})

const confirmBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
  
    if (!isValidObjectId(bookingId)) {
      throw new ApiErrors(400, "Invalid bookingId");
    }
  
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiErrors(404, "No booking found");
    }
  
    if (booking.bookingStatus === "Confirmed") {
      throw new ApiErrors(400, "Booking is already confirmed");
    }
  
    booking.bookingStatus = "Confirmed";
    await booking.save();
  
    return res
      .status(200)
      .json(new ApiResponse(200, { booking }, "Booking confirmed successfully"));
})

const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
  
    if (!isValidObjectId(bookingId)) {
      throw new ApiErrors(400, "Invalid bookingId");
    }
  
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiErrors(404, "No booking found");
    }
  
    if (booking.bookingStatus === "Cancelled") {
      throw new ApiErrors(400, "Booking is already cancelled");
    }
  
    booking.bookingStatus = "Cancelled";
    await booking.save();
  
    return res
      .status(200)
      .json(new ApiResponse(200, { booking }, "Booking cancelled successfully"));
})

const seatAvailability = asyncHandler(async (req, res) => {
    const { showTimeId } = req.params;
  
    if (!isValidObjectId(showTimeId)) {
      throw new ApiErrors(400, "Invalid showTimeId");
    }
  
    const showTime = await ShowTime.findById(showTimeId);
    if (!showTime) {
      throw new ApiErrors(404, "No showtime found");
    }
  
    const bookedSeats = await Booking.find({ showTimeId });
    const bookedSeatIds = bookedSeats.map((booking) =>
      booking.seats.map((s) => s.seatId.toString())
    ).flat();
  
    const availableSeats = await Seat.find({ screenId: showTime.screenId, _id: { $nin: bookedSeatIds } });
    return res
      .status(200)
      .json(new ApiResponse(200, { availableSeats }, "Available seats fetched successfully"));
})

const AllBookingOfUser = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, { bookings }, "Bookings fetched successfully"));
})
export{
    createBooking,
    getBookingDetails,
    geAllBookingOfShowTime,
    getBookingByScreen,
    geAllBookingOfTheater,
    getBookingByUserId,
    confirmBooking,
    cancelBooking,
    seatAvailability,
    AllBookingOfUser,
}