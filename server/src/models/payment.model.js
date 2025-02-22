import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["Credit Card", "Debit Card", "UPI", "Net Banking"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        required: true
    },
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    refundStatus: {
        type: String,
        enum: ["Not Initiated", "Processing", "Refunded"],
        default: "Not Initiated"
    },
},{timestamps:true});

export const Payment = mongoose.model("Payment", paymentSchema);
