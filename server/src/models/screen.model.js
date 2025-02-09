import mongoose, { Schema } from "mongoose";

const screenSchema = new Schema({
    screenNumber: {
        type: Number,
        required: true
    },
    threaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Threater",
        required: true
    },
    screenType: {
        type: String,
        enum: ["2D", "3D"],
        default: "2D"
    },
    totalSeats: {
        type: Number,
        required: true
    },
    seats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat"
    }]
},{timestamps:true});

export const Screen = mongoose.model("Screen", screenSchema);
