import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId }  from "mongoose";
import {Booking} from "../models/booking.model.js"
import { Payment } from "../models/payment.model.js";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique transaction ID
const createPayment = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { paymentMethod, cardNumber, expiryDate, upiId } = req.body;

    if (!isValidObjectId(bookingId)) {
        throw new ApiErrors(400, "Invalid booking ID");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiErrors(404, "Booking not found");
    }

    if (booking.totalAmount <= 0) {
        throw new ApiErrors(400, "No tickets selected, payment cannot be processed");
    }

    const allowedMethods = ["Credit Card", "Debit Card", "UPI"];
    if (!paymentMethod || !allowedMethods.includes(paymentMethod)) {
        throw new ApiErrors(400, "Invalid payment method");
    }

    let paymentDetails = {};
    if (paymentMethod === "Credit Card" || paymentMethod === "Debit Card") {
        if (!cardNumber || !expiryDate) {
            throw new ApiErrors(400, "Card details are required");
        }
        paymentDetails.cardNumber = `**** **** **** ${cardNumber.slice(-4)}`; // Masked
        paymentDetails.expiryDate = expiryDate;
    }
    if (paymentMethod === "UPI") {
        if (!upiId || !upiId.includes("@")) {
            throw new ApiErrors(400, "Invalid UPI ID");
        }
        paymentDetails.upiId = upiId;
    }

    let transactionId;
    do {
        transactionId = uuidv4();
    } while (await Payment.findOne({ transactionId }));

    const paymentStatus = "Pending"; 

    const payment = await Payment.create({
        bookingId,
        amount: booking.totalAmount,
        paymentMethod,
        paymentStatus,
        transactionId,
        ...paymentDetails, 
    });

    return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment created successfully"));
});


const confirmPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    if (!isValidObjectId(paymentId)) {
        throw new ApiErrors(400, "Invalid Payment ID");
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiErrors(404, "No Payment Found");
    }

    if (payment.paymentStatus === "Completed") {
        throw new ApiErrors(400, "Payment already confirmed");
    }

    payment.paymentStatus = "Completed";
    await payment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, { payment }, "Payment confirmed successfully"));
});
const getPaymentByBookingId= asyncHandler(async(req,res)=>{
    const {bookingId}=req.params
    if (!isValidObjectId(bookingId)) {
        throw new ApiErrors(400, "Invalid booking ID");
    }
    const booking= await Booking.findById(bookingId)
    if (!booking) {
        throw new ApiErrors(404, "No booking found");
      }
    const payments= await Payment.find({bookingId})
    return res
      .status(200)
      .json(new ApiResponse(200, { payments }, "Payments fetched successfully"));
})

const getPaymentByTransactionId= asyncHandler(async(req,res)=>{
    const {transactionId}=req.params
    if (!isValidObjectId(transactionId)) {
        throw new ApiErrors(400, "Invalid booking ID");
    }
    const transaction= await Payment.findById(transactionId)
    if (!transaction) {
        throw new ApiErrors(404, "No booking found");
      }
    const payments= await Payment.find({transactionId})
    return res
      .status(200)
      .json(new ApiResponse(200, { payments }, "Payments fetched successfully"));
})
const getAllPayments= asyncHandler(async(req,res)=>{
    const {page=1,limit=10,paymentMethod,sortBy,sortType}=req.query
    let pipeline=[];

    if(paymentMethod){
        pipeline.push({
            $match:{
                paymentMethod:paymentMethod
            }
        });
    }
    if(sortBy){
        pipeline.push({
            $sort:{
                [sortBy]:sortType==="asc"?1:-1
            }
        });
    }else{
        pipeline.push({
            $sort:{
                createdAt:-1
            }
        });
    }

    pipeline.push({
        $project:{
            _id: 1, 
            bookingId: 1,
            amount: 1,
            paymentMethod: 1,
            transactionId: 1,
            paymentStatus:0,
            refundStatus:0,
            createdAt: 1,
            updatedAt: 1
        }
    });
    const options={
        page:parseInt(page,10),
        limit:parseInt(limit,10)
    };
    // const payments=await Payment.aggregatePaginate(Payment.aggregate(pipeline),options);
    const payments = await Payment.aggregatePaginate(pipeline, options);

    return res
    .status(200)
    .json(new ApiResponse(200,payments,"Payments fetched successfully"))
})
const cancelPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    if (!isValidObjectId(paymentId)) {
        throw new ApiErrors(400, "Invalid Payment ID");
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiErrors(404, "Payment not found");
    }

    if (payment.paymentStatus === "Cancelled") {
        throw new ApiErrors(400, "Payment is already cancelled");
    }

    payment.paymentStatus = "Cancelled";
    payment.refundStatus = payment.paymentStatus === "Completed" ? "Processing" : "Not Initiated";

    await payment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { payment }, "Payment cancelled successfully"));
});
const markRefundAsDone = asyncHandler(async (req, res) => {
    const { paymentId } = req.params;

    if (!isValidObjectId(paymentId)) {
        throw new ApiErrors(400, "Invalid Payment ID");
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new ApiErrors(404, "Payment not found");
    }

    if (payment.paymentStatus !== "Cancelled") {
        throw new ApiErrors(400, "Refund can only be processed for cancelled payments");
    }

    if (payment.refundStatus === "Refunded") {
        throw new ApiErrors(400, "Refund has already been completed");
    }

    if (payment.refundStatus !== "Processing") {
        throw new ApiErrors(400, "Refund must be in processing state before marking it as done");
    }

    payment.refundStatus = "Refunded";
    await payment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { payment }, "Refund marked as completed successfully"));
});

export {
    createPayment,
    confirmPayment,
    getPaymentByBookingId,
    getPaymentByTransactionId,
    getAllPayments,
    cancelPayment,
    markRefundAsDone,
}