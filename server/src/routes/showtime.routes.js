// import { Router } from "express";
// import { verifyJWT, verifyRoles ,verifyAdmin} from "../middlewares/auth.middleware.js";
// import {
//     addShowtime,
//     updateShowtime,
//     deleteShowtime,
//     getShowtime,
//     getShowtimesforMovie,
//     getShowtimesforScreen,
//     getShowtimesforTheater,
//     getAvailableShowtimes
// } from "../controllers/showtime.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";
// const router = Router();
// router.use(verifyJWT, upload.none());
// router.route("/addShowtime/:movieId/:screenId").post(verifyRoles("admin"), addShowtime);   
// router.route("/deleteShowtime/:showtimeId").delete(verifyRoles("admin"), deleteShowtime);
// router.route("/updateShowtime/:showtimeId").patch(verifyRoles("admin"), updateShowtime);
// router.route("/getShowtime/:showtimeId").get(getShowtime);
// router.route("/getShowtimesforMovie/:movieId").get(getShowtimesforMovie);
// router.route("/getShowtimesforScreen/:screenId").get(getShowtimesforScreen);
// router.route("/getShowtimesforTheater/:theaterId").get(getShowtimesforTheater);
// router.route("/getAvailableShowtimes").get(getAvailableShowtimes);
// export default router;

import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import {
  addShowtime,
  updateShowtime,
  deleteShowtime,
  getShowtime,
  getShowtimesforMovie,
  getShowtimesforScreen,
  getShowtimesforTheater,
  getAvailableShowtimes,
} from "../controllers/showtime.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.route("/getShowtime/:showtimeId").get(getShowtime);
router.route("/getShowtimesforMovie/:movieId").get(getShowtimesforMovie);
router.route("/getShowtimesforScreen/:screenId").get(getShowtimesforScreen);
router.route("/getShowtimesforTheater/:theaterId").get(getShowtimesforTheater);
router.route("/getAvailableShowtimes").get(getAvailableShowtimes);

// Protected routes
router.use(verifyJWT, upload.none());

router.route("/addShowtime/:movieId/:screenId").post(verifyRoles("admin"), addShowtime);
router.route("/deleteShowtime/:showtimeId").delete(verifyRoles("admin"), deleteShowtime);
router.route("/updateShowtime/:showtimeId").patch(verifyRoles("admin"), updateShowtime);

export default router;