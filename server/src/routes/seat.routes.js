import { Router } from "express";
import{verifyJWT,verifyRoles} from "../middlewares/auth.middleware.js";
import {
    addSeatsForScreen,
    deleteSeatsForScreen,
    updateSeat,
    getSeatById,
    getSeatsByScreenId,
    checkSeatAvailability,
    reserveSeat,
    releaseSeat,
    confirmSeatBooking,
    cancelSeatBooking
}from "../controllers/seat.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.use(verifyJWT, upload.none());
router.route("/addSeats/:screenId").post(verifyRoles("admin"), addSeatsForScreen);
router.route("/deleteSeats/:screenId").delete(verifyRoles("admin"), deleteSeatsForScreen);
router.route("/updateSeat/:seatId").patch(verifyRoles("admin"), updateSeat);
router.route("/getSeat/:seatId").get(verifyRoles("admin,user"), getSeatById);
router.route("/getSeats/:screenId").get(verifyRoles("admin,user"), getSeatsByScreenId);
router.route("/checkAvailability/:seatId").get(verifyRoles("admin,user"), checkSeatAvailability);
router.route("/reserveSeat/:seatId").patch(verifyRoles("user"), reserveSeat);
router.route("/releaseSeat/:seatId").patch(verifyRoles("user"), releaseSeat);
router.route("/confirmSeatBooking/:seatId").patch(verifyRoles("user"), confirmSeatBooking);
router.route("/cancelSeatBooking/:seatId").patch(verifyRoles("user"), cancelSeatBooking);
export default router;