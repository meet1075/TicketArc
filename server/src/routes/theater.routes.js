import { Router } from "express";
import { verifyAdmin,verifyJWT } from "../middlewares/auth.middleware.js";
import { addTheater,deleteTheater,updateTheater,getAllTheater,getTheaterById, searchTheaters, addScreenToTheater, removeScreenFromTheater, getTheatersWithScreenDetails } from "../controllers/theater.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()
router.use(verifyJWT,upload.none())

router.route("/addTheater").post(addTheater,verifyAdmin)
router.route("/deleteTheater/:theaterId").delete(deleteTheater,verifyAdmin)
router.route("/updateTheater/:theaterId").patch(updateTheater,verifyAdmin)
router.route("/getTheater/:theaterId").get(getTheaterById,verifyAdmin)
router.route("/getAllTheater").get(getAllTheater,verifyAdmin)
router.route("/theaters/search").get(searchTheaters);
router.route("/theaters/addScreen/:theaterId").post(addScreenToTheater,verifyAdmin);
router.route("/theaters/deleteScreen/:theaterId/:screenId").delete(removeScreenFromTheater,verifyAdmin);
router.route("/theaters/allScreen/:theaterId").get(getTheatersWithScreenDetails,verifyAdmin);


export default router