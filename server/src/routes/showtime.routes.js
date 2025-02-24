import { Router } from "express";
import { verifyJWT, verifyRoles ,verifyAdmin} from "../middlewares/auth.middleware.js";
import {
    addShowtime,
    updateShowtime,
    deleteShowtime,
    getShowtime,
    getShowtimesforMovie,
    getShowtimesforScreen,
    getShowtimesforTheater,
    getAvailableShowtimes
} from "../controllers/showtime.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.use(verifyJWT, upload.none());
router.route("/addShowtime/:movieId/:screenId").post(verifyRoles("admin"), addShowtime);   
router.route("/deleteShowtime/:showtimeId").delete(verifyRoles("admin"), deleteShowtime);
router.route("/updateShowtime/:showtimeId").patch(verifyRoles("admin"), updateShowtime);
router.route("/getShowtime/:showtimeId").get(verifyRoles("admin", "user"), getShowtime);
router.route("/getShowtimesforMovie/:movieId").get(verifyRoles("admin", "user"), getShowtimesforMovie); 
router.route("/getShowtimesforScreen/:screenId").get(verifyRoles("admin", "user"), getShowtimesforScreen);
router.route("/getShowtimesforTheater/:theaterId").get(verifyRoles("admin", "user"), getShowtimesforTheater);
router.route("/getAvailableShowtimes").get(verifyRoles("admin", "user"), getAvailableShowtimes);
export default router;