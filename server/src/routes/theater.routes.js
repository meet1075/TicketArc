// import { Router } from "express";
// import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
// import {
//   addTheater,
//   deleteTheater,
//   updateTheater,
//   getAllTheater,
//   getTheaterById,
//   searchTheaters,
//   addScreenToTheater,
//   removeScreenFromTheater,
//   getTheatersWithScreenDetails,
// } from "../controllers/theater.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";

// const router = Router();

// // Public routes
// router.route("/getAllTheater").get(getAllTheater);
// router.route("/getTheater/:theaterId").get(getTheaterById);
// router.route("/theaters/search").get(searchTheaters);
// router.route("/theaters/allScreen/:theaterId").get(getTheatersWithScreenDetails);

// // Protected routes
// router.use(verifyJWT, upload.none());

// router.route("/addTheater").post(verifyRoles("admin"), addTheater);
// router.route("/deleteTheater/:theaterId").delete(verifyRoles("admin"), deleteTheater);
// router.route("/updateTheater/:theaterId").patch(verifyRoles("admin"), updateTheater);
// router.route("/theaters/addScreen/:theaterId").post(verifyRoles("admin"), addScreenToTheater);
// router.route("/theaters/deleteScreen/:theaterId/:screenId").delete(verifyRoles("admin"), removeScreenFromTheater);

// export default router;

import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import {
  addTheater,
  deleteTheater,
  updateTheater,
  getAllTheater,
  getTheaterById,
  searchTheaters,
  addScreenToTheater,
  removeScreenFromTheater,
  getTheatersWithScreenDetails,
} from "../controllers/theater.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.route("/getAllTheater").get(getAllTheater);
router.route("/getTheater/:theaterId").get(getTheaterById);
router.route("/theaters/search").get(searchTheaters);
router.route("/theaters/allScreen/:theaterId").get(getTheatersWithScreenDetails);

// Protected routes
router.use(verifyJWT, upload.none());

router.route("/addTheater").post(verifyRoles("admin"), addTheater);
router.route("/deleteTheater/:theaterId").delete(verifyRoles("admin"), deleteTheater);
router.route("/updateTheater/:theaterId").patch(verifyRoles("admin"), updateTheater);
router.route("/theaters/addScreen/:theaterId").post(verifyRoles("admin"), addScreenToTheater);
router.route("/theaters/deleteScreen/:theaterId/:screenId").delete(verifyRoles("admin"), removeScreenFromTheater);

export default router;