import { Router } from "express";
import {
    createBooking,
    getBookingDetails,
    cancelBooking,
    getAllBookingsOfShowTime,
    getAllBookingsOfUser,
    seatAvailability
} from "../controllers/booking.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, upload.none());

// Booking routes
router.route("/create/:paymentId").post(verifyRoles("user"), createBooking);
router.route("/:bookingId").get(verifyRoles("admin", "user"), getBookingDetails);
router.route("/:bookingId/cancel").delete(verifyRoles("admin", "user"), cancelBooking);
router.route("/showtime/:showtimeId").get(verifyRoles("admin"), getAllBookingsOfShowTime);
router.route("/user/:userId").get(verifyRoles("user", "admin"), getAllBookingsOfUser);
router.route("/availability/:showtimeId").get(verifyRoles("admin", "user"), seatAvailability);

export default router;
