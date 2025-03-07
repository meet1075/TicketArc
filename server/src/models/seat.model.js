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
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    }
},{timestamps:true});

export const Seat = mongoose.model("Seat", seatSchema);
