import e, { Router } from "express";
import { getScreenById, getAllScreen, updateScreen, searchScreen } from "../controllers/screen.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin,verifyJWT,verifyUser } from "../middlewares/auth.middleware.js";

const router=Router()
router.use(verifyJWT)
router.route("/update/:screenId").patch(verifyAdmin,updateScreen)
router.route("/getscreen/:screenId").get(verifyAdmin,getScreenById)
router.route("/search").get(verifyAdmin,searchScreen)
router.route("/getAll").get(verifyAdmin,getAllScreen)
export default router