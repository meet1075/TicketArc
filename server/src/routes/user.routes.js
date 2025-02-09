import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { login, register, logout, refreshAccessToken, getCurrentUser, updateAccountDetails, changeCurrentPassword, bookingHistory } from "../controllers/user.controller.js";

const router = Router();


router.route("/register").post(register);
router.route("/register-admin").post(verifyJWT, verifyAdmin, register);
router.route("/refreshToken").post(verifyJWT,refreshAccessToken)
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/currentUser").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/booking-history").post(verifyJWT,bookingHistory)


export default router;
