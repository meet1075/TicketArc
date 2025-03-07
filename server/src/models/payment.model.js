import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
        enum: ["Credit Card", "Debit Card", "UPI"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Refunded","Cancelled"],
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
paymentSchema.plugin(mongooseAggregatePaginate);

export const Payment = mongoose.model("Payment", paymentSchema);
