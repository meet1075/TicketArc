import mongoose, { Schema } from "mongoose";

const seatAvailabilitySchema = new Schema({
    seatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true
    },
    seatNumber: { 
        type: String, 
        required: true 
    }, 
    showtimeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShowTime",
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isReserved: {
        type: Boolean,
        default: false
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    reservationExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export const SeatAvailability = mongoose.model("SeatAvailability", seatAvailabilitySchema);
