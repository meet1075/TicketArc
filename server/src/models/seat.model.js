import mongoose, { Schema } from "mongoose";

const seatSchema = new Schema({
    seatNumber: {
        type: String,
        required: true
    },
    seatType: {
        type: String,
        enum: ["regular", "premium"],
        required: true
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },
    status: {
        type: String,
        enum: ["available", "booked", "reserved"],
        default: "available"
    }
},{timestamps:true});

export const Seat = mongoose.model("Seat", seatSchema);
