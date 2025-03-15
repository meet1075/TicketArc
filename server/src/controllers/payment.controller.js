import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Payment } from "../models/payment.model.js";
import { v4 as uuidv4 } from "uuid"; 
import { SeatAvailability } from "../models/seatAvailability.model.js";
import { ShowTime } from "../models/showtime.model.js";
const createPayment = asyncHandler(async (req, res) => {
    const { seatAvailabilityId, showtimeId, paymentMethod, cardNumber, expiryDate, upiId } = req.body;

    if (!seatAvailabilityId || !Array.isArray(seatAvailabilityId) || seatAvailabilityId.length === 0) {
        throw new ApiErrors(400, "At least one seat must be selected for payment.");
    }

    if (!showtimeId || !mongoose.Types.ObjectId.isValid(showtimeId)) {
        throw new ApiErrors(400, "Invalid or missing showtimeId.");
    }

    // Fetch showtime and seats in parallel
    const [showtime, seats] = await Promise.all([
        ShowTime.findById(showtimeId),
        SeatAvailability.find({ _id: { $in: seatAvailabilityId }, isReserved: true }).select("seatNumber isVIP showtimeId")
    ]);

    if (!showtime) throw new ApiErrors(404, "Showtime not found.");
    if (seats.length !== seatAvailabilityId.length) throw new ApiErrors(400, "One or more selected seats are not reserved.");

    // Ensure all seats belong to the same showtime
    if (seats.some(seat => seat.showtimeId.toString() !== showtimeId)) {
        throw new ApiErrors(400, "Selected seats do not match the provided showtime.");
    }

    // Calculate total amount
    let totalAmount = seats.reduce((sum, seat) => sum + (seat.isVIP ? showtime.price.Premium : showtime.price.Regular), 0);

    // Validate payment method
    const allowedMethods = ["Credit Card", "Debit Card", "UPI"];
    if (!paymentMethod || !allowedMethods.includes(paymentMethod)) {
        throw new ApiErrors(400, "Invalid payment method.");
    }

    let paymentDetails = {};
    if (["Credit Card", "Debit Card"].includes(paymentMethod)) {
        if (!cardNumber || !expiryDate) throw new ApiErrors(400, "Card details are required.");
        paymentDetails.cardNumber = `**** **** **** ${cardNumber.slice(-4)}`;
        paymentDetails.expiryDate = expiryDate;
    } else if (paymentMethod === "UPI") {
        if (!upiId || !upiId.includes("@")) throw new ApiErrors(400, "Invalid UPI ID.");
        paymentDetails.upiId = upiId;
    }

    // Generate Unique Transaction ID
    let transactionId = uuidv4();
    while (await Payment.exists({ transactionId })) {
        transactionId = uuidv4();
    }

    // Create Payment
    const payment = await Payment.create({
        seatAvailabilityId, // Change to seatAvailabilityIds if storing multiple seats
        amount: totalAmount,
        paymentMethod,
        paymentStatus: "Completed",
        transactionId,
        showtimeId,
        ...paymentDetails,
    });

    return res.status(200).json(new ApiResponse(200, payment, "Payment created successfully"));
});





const getPaymentByBookingId = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    if (!isValidObjectId(bookingId)) throw new ApiErrors(400, "Invalid booking ID");

    const payments = await Payment.find({ bookingId });
    return res.status(200).json(new ApiResponse(200, { payments }, "Payments fetched successfully"));
});

const getPaymentByTransactionId = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;

    const payment = await Payment.findOne({ transactionId });
    if (!payment) throw new ApiErrors(404, "No payment found");

    return res.status(200).json(new ApiResponse(200, { payment }, "Payment fetched successfully"));
});

const getAllPayments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, paymentMethod, sortBy, sortType } = req.query;
    let pipeline = [];

    if (paymentMethod) pipeline.push({ $match: { paymentMethod } });

    pipeline.push({ $sort: { [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1 } });

    pipeline.push({
        $project: {
            _id: 1,
            bookingId: 1,
            amount: 1,
            paymentMethod: 1,
            transactionId: 1,
            createdAt: 1,
            updatedAt: 1
        }
    });

    const payments = await Payment.aggregate(pipeline).exec();
    return res.status(200).json(new ApiResponse(200, payments, "Payments fetched successfully"));
});

const cancelPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    if (!isValidObjectId(paymentId)) throw new ApiErrors(400, "Invalid Payment ID");

    const payment = await Payment.findById(paymentId);
    if (!payment) throw new ApiErrors(404, "Payment not found");

    if (payment.paymentStatus === "Cancelled") throw new ApiErrors(400, "Payment is already cancelled");

    payment.paymentStatus = "Cancelled";
    payment.refundStatus = payment.paymentStatus === "Completed" ? "Processing" : "Not Initiated";

    await payment.save();
    return res.status(200).json(new ApiResponse(200, { payment }, "Payment cancelled successfully"));
});

const markRefundAsDone = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    if (!isValidObjectId(paymentId)) throw new ApiErrors(400, "Invalid Payment ID");

    const payment = await Payment.findById(paymentId);
    if (!payment) throw new ApiErrors(404, "Payment not found");

    if (payment.paymentStatus !== "Cancelled") throw new ApiErrors(400, "Refund can only be processed for cancelled payments");

    if (payment.refundStatus === "Refunded") throw new ApiErrors(400, "Refund has already been completed");

    if (payment.refundStatus !== "Processing") throw new ApiErrors(400, "Refund must be in processing state before marking it as done");

    payment.refundStatus = "Refunded";
    await payment.save();

    return res.status(200).json(new ApiResponse(200, { payment }, "Refund marked as completed successfully"));
});
export {
    createPayment,
    getPaymentByBookingId,
    getPaymentByTransactionId,
    getAllPayments,
    cancelPayment,
    markRefundAsDone,
};
