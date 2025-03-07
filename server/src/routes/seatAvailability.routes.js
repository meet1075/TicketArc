import e, { Router } from "express";
import{verifyJWT,verifyRoles} from "../middlewares/auth.middleware.js";
import{
    createSeatAvailabilityForShowtime,
    checkSeatAvailability,
    reserveSeat,
    releaseSeat,
    confirmSeatBooking,
    cancelSeatBooking
}
from "../controllers/seat.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.use(verifyJWT, upload.none());
router.route("/createSeatAvailability/:showtimeId/:screenId").post(verifyRoles("admin"), createSeatAvailabilityForShowtime);
router.route("/checkSeatAvailability/:seatId/:showtimeId").get(verifyRoles("admin,user"), checkSeatAvailability);
router.route("/reserveSeat/:seatAvailabilityId").patch(verifyRoles("admin,user"), reserveSeat);
router.route("/releaseSeat/:seatAvailabilityId").patch(verifyRoles("admin,user"), releaseSeat);
router.route("/confirmSeatBooking/:seatAvailabilityId").patch(verifyRoles("admin,user"), confirmSeatBooking);
router.route("/cancelSeatBooking/:seatAvailabilityId").patch(verifyRoles("admin,user"), cancelSeatBooking);
export default router;