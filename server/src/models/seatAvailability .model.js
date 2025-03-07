import mongoose, { Schema } from "mongoose";

const seatAvailabilitySchema = new Schema({
    seatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
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
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
},{timestamps:true});

export const SeatAvailability = mongoose.model("SeatAvailability", seatAvailabilitySchema);
