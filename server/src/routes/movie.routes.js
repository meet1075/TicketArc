// import { Router } from "express";
// import { verifyAdmin,verifyJWT ,verifyRoles} from "../middlewares/auth.middleware.js";
// import {upload} from '../middlewares/multer.middleware.js'
// import {addMovie,
//     deleteMovie,
//     updateMovie,
//     getMovieById,
//     getAllMovies} from '../controllers/movie.controller.js'
// const router=Router()
// router.use(verifyJWT)
// router.route("/addMovie").post(
//     upload.fields([{ name: "movieImage", maxCount: 1 }]),
//     verifyRoles("admin"),
//     addMovie
//   );
  
//   router.route("/update/:movieId").patch(
//     upload.single("movieImage"),
//     verifyRoles("admin"),
//     updateMovie
//   );
  
//   router.route("/delete/:movieId").delete(
//     verifyRoles("admin"),
//     deleteMovie
//   );
  
//   router.route("/getMovie/:movieId").get(
//     getMovieById
//   );
  
//   router.route("/getAllMovie").get(
//     getAllMovies
//   );
  
// export default router

import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import { upload } from '../middlewares/multer.middleware.js';
import {
  addMovie,
  deleteMovie,
  updateMovie,
  getMovieById,
  getAllMovies
} from '../controllers/movie.controller.js';

const router = Router();

// Public routes (no authentication required)
router.route("/getAllMovie").get(getAllMovies);
router.route("/getMovie/:movieId").get(getMovieById);

// Protected routes (require JWT and role checks)
router.use(verifyJWT); // Apply verifyJWT only to routes below this line

router.route("/addMovie").post(
  upload.fields([{ name: "movieImage", maxCount: 1 }]),
  verifyRoles("admin"),
  addMovie
);

router.route("/update/:movieId").patch(
  upload.single("movieImage"),
  verifyRoles("admin"),
  updateMovie
);

router.route("/delete/:movieId").delete(
  verifyRoles("admin"),
  deleteMovie
);

export default router;