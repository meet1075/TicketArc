import { Router } from "express";
import { verifyAdmin,verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from '../middlewares/multer.middleware.js'
import {addMovie,
    deleteMovie,
    updateMovie,
    getMovieById,
    getAllMovies} from '../controllers/movie.controller.js'
const router=Router()
router.use(verifyJWT)
router.route("/addMovie").post(
    upload.fields([
        {
            name:"movieImage",
            maxCount:1
        }
    ]),verifyAdmin,addMovie)
    router.route("/update/:movieId").patch(upload.single("movieImage"),verifyAdmin,updateMovie)
    router.route("/delete/:movieId").delete(verifyAdmin,deleteMovie)
    router.route("/getMovie/:movieId").get(verifyAdmin,getMovieById)
    router.route("/getAllMovie").get(verifyAdmin,getAllMovies)
export default router