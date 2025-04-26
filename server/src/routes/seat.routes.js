import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import {
  addSeatsForScreen,
  deleteSeatsForScreen,
  updateSeat,
  getSeatById,
  getSeatsByScreenId,
  getSeatLayoutForShowtime,
} from "../controllers/seat.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.use(verifyJWT, upload.none());
router.route("/addSeats/:screenId").post(verifyRoles("admin"), addSeatsForScreen);
router.route("/deleteSeats/:screenId").delete(verifyRoles("admin"), deleteSeatsForScreen);
router.route("/updateSeat/:seatId").patch(verifyRoles("admin"), updateSeat);
router.route("/getSeat/:seatId").get(verifyRoles("admin,user"), getSeatById);
router.route("/getSeats/:screenId").get(verifyRoles("admin,user"), getSeatsByScreenId);
router.route("/layout/:screenId/:showtimeId").get(verifyRoles("admin,user"), getSeatLayoutForShowtime);
export default router;