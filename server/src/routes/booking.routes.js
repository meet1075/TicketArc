import { Router } from "express";
import {
    createBooking,
    getBookingDetails,  
    geAllBookingOfShowTime,
    getBookingByScreen,
    geAllBookingOfTheater,
    getBookingByUserId,
    confirmBooking,
    cancelBooking,
    seatAvailability,
    AllBookingOfUser,
} from "../controllers/booking.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin,verifyJWT,verifyRoles } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT,upload.none());
router.route("/createBooking").post(verifyRoles("user"),createBooking);
router.route("/getBookingDetails/:bookingId").get(verifyRoles("admin,user"),getBookingDetails);
router.route("/geAllBookingOfShowTime/:showTimeId").get(verifyRoles("admin"),geAllBookingOfShowTime);
router.route("/getBookingByScreen/:screenId").get(verifyRoles("admin"),getBookingByScreen);
router.route("/geAllBookingOfTheater/:theaterId").get(verifyRoles("admin"),geAllBookingOfTheater);
router.route("/getBookingByUserId/:userId").get(verifyRoles("user"),getBookingByUserId);
router.route("/confirmBooking/:bookingId").patch(verifyRoles("admin,user"),confirmBooking);
router.route("/cancelBooking/:bookingId").patch(verifyRoles("admin,user"),cancelBooking);
router.route("/seatAvailability/:showTimeId").get(verifyRoles("admin,user"),seatAvailability);
router.route("/AllBookingOfUser").get(verifyRoles("user,admin"),AllBookingOfUser);
export default router;