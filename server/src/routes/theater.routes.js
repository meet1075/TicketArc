import { Router } from "express";
import { verifyAdmin,verifyJWT, verifyUser ,verifyRoles} from "../middlewares/auth.middleware.js";
import { addTheater,deleteTheater,updateTheater,getAllTheater,getTheaterById, searchTheaters, addScreenToTheater, removeScreenFromTheater, getTheatersWithScreenDetails } from "../controllers/theater.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()
router.use(verifyJWT,upload.none())

router.route("/addTheater").post(verifyRoles("admin"), addTheater);
router.route("/deleteTheater/:theaterId").delete(verifyRoles("admin"), deleteTheater);
router.route("/updateTheater/:theaterId").patch(verifyRoles("admin"), updateTheater);
router.route("/getTheater/:theaterId").get(verifyRoles("admin", "user"), getTheaterById);
router.route("/getAllTheater").get(verifyRoles("admin"), getAllTheater);
router.route("/theaters/search").get(searchTheaters);
router.route("/theaters/addScreen/:theaterId").post(verifyRoles("admin"), addScreenToTheater);
router.route("/theaters/deleteScreen/:theaterId/:screenId").delete(verifyRoles("admin"), removeScreenFromTheater);
router.route("/theaters/allScreen/:theaterId").get(verifyRoles("admin"), getTheatersWithScreenDetails);



export default router