import mongoose, { Schema } from "mongoose";

const seatSchema = new Schema({
    seatNumber: {
        type: String,
        required: true
    },
    seatType: {
        type: String,
        enum: ["Regular", "Premium"],
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    showtimeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShowTime",
        required: true
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
},{timestamps:true});

export const Seat = mongoose.model("Seat", seatSchema);
