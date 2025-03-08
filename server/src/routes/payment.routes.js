import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import {
    createPayment,
    confirmPayment,
    getPaymentByBookingId,
    getPaymentByTransactionId,
    getAllPayments,
    cancelPayment,
    markRefundAsDone,
} from "../controllers/payment.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT, upload.none());

// User routes
router.route("/createPayment/:bookingId").post(verifyRoles("user"), createPayment);
router.route("/confirmPayment/:paymentId").post(verifyRoles("user"), confirmPayment);
router.route("/cancelPayment/:paymentId").patch(verifyRoles("user"), cancelPayment);

router.route("/PaymentByBookingId/:bookingId").get(verifyRoles("admin", "user"), getPaymentByBookingId);
router.route("/PaymentByTransactionId/:transactionId").get(verifyRoles("admin", "user"), getPaymentByTransactionId);

router.route("/getAllPayments").get(verifyRoles("admin"), getAllPayments);
router.route("/refund/:paymentId").patch(verifyRoles("admin"), markRefundAsDone);

export default router;
