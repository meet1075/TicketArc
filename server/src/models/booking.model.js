import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
    showtimeId: {  
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
                ref: "SeatAvailability",
                required: true,
            },
            seatNumber: {  // ✅ Ensuring seatNumber is stored
                type: String,
                required: true,
            },
            seatType: {
                type: String,
                enum: ["Regular", "Premium"], 
                default: "Regular",
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    bookingTime: {
        type: Date,
        default: Date.now,
    },
    bookingStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending",
    },
    paymentId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
    },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);
