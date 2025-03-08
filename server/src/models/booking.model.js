import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    showTimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowTime",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seats: [
      {
        seatId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SeatAvailability", // Updated reference
          required: true,
        },
        seatNumber: {
          type: String,
          required: true,
        },
        seatType: {
          type: String,
          enum: ["Regular", "Premium"], // Update based on actual seat types
          default: "Regular",
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    bookingTime: {
      type: Date,
      default: Date.now, // Removed `required: true`
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"], // Added field for tracking payments
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
