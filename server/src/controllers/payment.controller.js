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
    const { seatAvailabilityId, paymentMethod, transactionId, amount } = req.body; // Accept amount if provided
    const userId = req.user?._id;

    if (!userId) throw new ApiErrors(401, "User not authenticated");
    if (!seatAvailabilityId) throw new ApiErrors(400, "Missing seatAvailabilityId");
    if (!amount || amount <= 0) throw new ApiErrors(400, "Invalid amount");

    // ✅ Fetch Seat Availability & Populate Seat Type
    const seatAvailability = await SeatAvailability.findById(seatAvailabilityId)
      .populate({
        path: "seatId",
        select: "seatType seatNumber",
      })
      .populate({
        path: "showtimeId",
        select: "movieId price",
      });

    if (!seatAvailability) throw new ApiErrors(404, "Seat Availability not found");
    if (!seatAvailability.seatId) throw new ApiErrors(404, "Seat data not found");
    if (!seatAvailability.showtimeId) throw new ApiErrors(404, "Showtime not found");

    if (seatAvailability.isBooked) throw new ApiErrors(400, "Seat is already booked");
    if (!seatAvailability.isReserved || seatAvailability.reservedBy?.toString() !== userId.toString()) {
      throw new ApiErrors(400, "Seat is not reserved by you or has expired");
    }

    // ✅ Ensure transactionId is provided (generate if missing)
    const paymentTransactionId = transactionId || uuidv4(); // Generate a unique ID if not provided

    // ✅ Create Payment
    const payment = await Payment.create({
      userId,
      amount,
      paymentMethod,
      transactionId: paymentTransactionId,
      paymentStatus: "Completed", // Assuming instant payment success
      seatAvailabilityId: seatAvailability._id,
    });

    return res.status(201).json(new ApiResponse(201, { payment }, "Payment processed successfully."));
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
