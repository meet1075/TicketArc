import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema({
    showTimeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShowTime"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    seats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat"
    }],
    bookingTime: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
    }
},{timestamps:true});

export const Booking = mongoose.model("Booking", bookingSchema);
