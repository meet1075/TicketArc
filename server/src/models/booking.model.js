// import mongoose, { Schema } from 'mongoose';

// const bookingSchema = new Schema({
//     showTimeId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "ShowTime"
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     seats: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Seat"
//     }],
//     bookingTime: {
//         type: Date,
//         required: true
//     },
//     totalAmount: {
//         type: Number,
//         required: true
//     },
//     bookingStatus: {
//         type: String,
//         enum: ["Pending", "Confirmed", "Cancelled"],
//         default: "Pending"
//     }
// },{timestamps:true});

// export const Booking = mongoose.model("Booking", bookingSchema);
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
    seats: [{
        seatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seat",
            required: true
        },
        seatNumber: {
            type: String,
            required: true
        },
        seatType: {
            type: String,
            enum: ["Regular", "Premium"],
            default: "Regular"
        },
        price:{
            type: Number,
            required: true
        }
    }],
    bookingTime: {
      type: Date,
      required: true,
      default: Date.now,
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
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
