import mongoose, { Schema } from "mongoose";

const showTimeSchema = new Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    showDateTime: {
        type: Date,
        required: true
    },
    price: {
        Regular: {
            type: Number,
            required: true
        },
        Premium: {
            type: Number,
            required: true
        }   
    },
    status: {
        type: String,
        enum: ["Scheduled", "Cancelled", "Completed"],
        default: "Scheduled"
    },
    bookingLimit: {
        type: Number,
        required: true
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    }
},{timestamps:true});

export const ShowTime = mongoose.model("ShowTime", showTimeSchema);
