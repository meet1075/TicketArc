// import { asyncHandler } from "../utils/asyncHandler.js";
// import{ApiErrors} from "../utils/ApiErrors.js";
// import{ApiResponse} from "../utils/ApiResponse.js";
// import{ShowTime} from "../models/showtime.model.js";
// import{Movie} from "../models/movie.model.js";
// import{Screen} from "../models/screen.model.js";
// import mongoose, { isValidObjectId } from 'mongoose';
// import { Theater } from "../models/theater.model.js";
// const addShowtime = asyncHandler(async (req, res) => {
//     const { movieId, screenId } = req.params;
  
//     if (!isValidObjectId(movieId) || !isValidObjectId(screenId)) {
//       throw new ApiErrors(400, "Invalid movieId or screenId");
//     }
  
//     const { showDateTime, status,price } = req.body;
  
//     if (!showDateTime || !status || !price) {
//       throw new ApiErrors(400, "showDateTime and status and price are required");
//     }
  
//     const allowedStatuses = ["Scheduled", "Cancelled", "Completed"];
//     if (!allowedStatuses.includes(status)) {
//       throw new ApiErrors(400, `Status must be one of: ${allowedStatuses.join(", ")}`);
//     }
  
//     if (req.user.role !== "admin") {
//       throw new ApiErrors(403, "Only admins can add showtime");
//     }
  
//     const movie = await Movie.findById(movieId);
//     if (!movie) {
//       throw new ApiErrors(404, "No movie found");
//     }
  
//     const screen = await Screen.findById(screenId);
//     if (!screen) {
//       throw new ApiErrors(404, "No screen found");
//     }
  
//     const theater = await Theater.findById(screen.theaterId);
//     if (!theater) {
//       throw new ApiErrors(404, "No theater found");
//     }
  
//     const now = new Date();
//     let finalStatus = status;
//     if (new Date(showDateTime) < now && status !== "Cancelled") {
//       finalStatus = "Completed";
//     }
  
//     const showtime = await ShowTime.create({
//       movieId,
//       screenId,
//       showDateTime,
//       price,
//       status: finalStatus,
//       bookingLimit: screen.totalSeats,
//     });
  
//     if (!showtime) {
//       throw new ApiErrors(500, "Failed to add showtime");
//     }
  
//     return res.status(200).json(new ApiResponse(200, showtime, "Showtime added successfully"));
//   });

// const updateShowtime = asyncHandler(async (req, res) => {
//     const { showtimeId } = req.params;
//     const { showDateTime, status ,price} = req.body;
//     if (!isValidObjectId(showtimeId)) {
//       throw new ApiErrors(400, "Invalid showtime Id");
//     }
//     const showtime = await ShowTime.findById(showtimeId);
//     if (!showtime) {
//       throw new ApiErrors(404, "Showtime not found");
//     }
//     if (req.user.role !== "admin") {
//       throw new ApiErrors(403, "Only admins can update showtime");
//     }
//     const now = new Date();
//     let finalStatus = status;
//     if (new Date(showDateTime) < now && status !== "Cancelled") {
//       finalStatus = "Completed";
//     }
//     const updatedShowtime=await ShowTime.findByIdAndUpdate(
//         showtimeId,
//       {
//         $set: {
//           showDateTime: showDateTime??showtime.showDateTime,
//           status: finalStatus??showtime.status,
//           price: price??showtime.price,
//         },
//       },
//       { new: true }
//     );
//     if (!updatedShowtime) {
//       throw new ApiErrors(500, "Failed to update showtime");
//     }
//     return res
//     .status(200)
//     .json(new ApiResponse(200, updatedShowtime, "Showtime updated successfully"));
// })
// const deleteShowtime = asyncHandler(async (req, res) => {
//     const { showtimeId } = req.params;
//     if (!isValidObjectId(showtimeId)) {
//       throw new ApiErrors(400, "Invalid showtime Id");
//     }
//     const showtime = await ShowTime.findById(showtimeId);
//     if (!showtime) {
//       throw new ApiErrors(404, "Showtime not found");
//     }
//     if (req.user.role !== "admin") {
//       throw new ApiErrors(403, "Only admins can delete showtime");
//     }
//     const deletedShowtime = await ShowTime.findByIdAndDelete(showtimeId);
//     if (!deletedShowtime) {
//       throw new ApiErrors(500, "Failed to delete showtime");
//     }
//     return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Showtime deleted successfully"));
// })
// const getShowtime = asyncHandler(async (req, res) => {
//     const { showtimeId } = req.params;
//     if (!isValidObjectId(showtimeId)) {
//       throw new ApiErrors(400, "Invalid showtime Id");
//     }
//     const showtime = await ShowTime.findById(showtimeId);
//     if (!showtime) {
//       throw new ApiErrors(404, "Showtime not found");
//     }
//     return res.status(200).json(new ApiResponse(200, showtime, "Showtime found"));
// })
// const getShowtimesforMovie = asyncHandler(async (req, res) => {
//   const { movieId } = req.params;
//   if (!isValidObjectId(movieId)) {
//     throw new ApiErrors(400, "Invalid movie Id");
//   }
//   const showtimes = await ShowTime.find({ movieId }).populate('screenId');
//   return res.status(200).json(new ApiResponse(200, showtimes, "Showtimes found"));
// });

// const getShowtimesforScreen = asyncHandler(async (req, res) => {
//   const { screenId } = req.params;
//   if (!isValidObjectId(screenId)) {
//     throw new ApiErrors(400, "Invalid screen Id");
//   }
//   const showtimes = await ShowTime.find({ screenId });
//   return res.status(200).json(new ApiResponse(200, showtimes, "Showtimes found"));
// });
// const getShowtimesforTheater = asyncHandler(async (req, res) => {
//     const { theaterId } = req.params;
//     if (!isValidObjectId(theaterId)) {
//       throw new ApiErrors(400, "Invalid theater Id");
//     }
//     const screens = await Screen.find({ theaterId });
//     const screenIds = screens.map((screen) => screen._id);
//     const showtimes = await ShowTime.find({ screenId: { $in: screenIds } });
//     return res
//     .status(200)
//     .json(new ApiResponse(200, showtimes, "Showtimes found"));
// })
// const getAvailableShowtimes = asyncHandler(async (req, res) => {
//     const showtimes = await ShowTime.find({ status: "Scheduled" });
//     return res
//     .status(200)
//     .json(new ApiResponse(200, showtimes, "Showtimes found"));
// })
// export {
//     addShowtime,
//     updateShowtime,
//     deleteShowtime,
//     getShowtime,
//     getShowtimesforMovie,
//     getShowtimesforScreen,
//     getShowtimesforTheater,
//     getAvailableShowtimes
// }

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ShowTime } from "../models/showtime.model.js";
import { Movie } from "../models/movie.model.js";
import { Screen } from "../models/screen.model.js";
import { Theater } from "../models/theater.model.js";
import mongoose, { isValidObjectId } from 'mongoose';

const addShowtime = asyncHandler(async (req, res) => {
  const { movieId, screenId } = req.params;

  if (!isValidObjectId(movieId) || !isValidObjectId(screenId)) {
    throw new ApiErrors(400, "Invalid movieId or screenId");
  }

  const { showDateTime, status, price } = req.body;

  if (!showDateTime || !status || !price) {
    throw new ApiErrors(400, "showDateTime, status, and price are required");
  }

  const allowedStatuses = ["Scheduled", "Cancelled", "Completed"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiErrors(400, `Status must be one of: ${allowedStatuses.join(", ")}`);
  }

  if (req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admins can add showtime");
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new ApiErrors(404, "No movie found");
  }

  const screen = await Screen.findById(screenId);
  if (!screen) {
    throw new ApiErrors(404, "No screen found");
  }

  const theater = await Theater.findById(screen.theaterId);
  if (!theater) {
    throw new ApiErrors(404, "No theater found");
  }

  const now = new Date();
  let finalStatus = status;
  if (new Date(showDateTime) < now && status !== "Cancelled") {
    finalStatus = "Completed";
  }

  const showtime = await ShowTime.create({
    movieId,
    screenId,
    showDateTime,
    price,
    status: finalStatus,
    bookingLimit: screen.totalSeats,
  });

  if (!showtime) {
    throw new ApiErrors(500, "Failed to add showtime");
  }

  return res.status(200).json(new ApiResponse(200, showtime, "Showtime added successfully"));
});

const updateShowtime = asyncHandler(async (req, res) => {
  const { showtimeId } = req.params;
  const { showDateTime, status, price } = req.body;
  if (!isValidObjectId(showtimeId)) {
    throw new ApiErrors(400, "Invalid showtime Id");
  }
  const showtime = await ShowTime.findById(showtimeId);
  if (!showtime) {
    throw new ApiErrors(404, "Showtime not found");
  }
  if (req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admins can update showtime");
  }
  const now = new Date();
  let finalStatus = status;
  if (new Date(showDateTime) < now && status !== "Cancelled") {
    finalStatus = "Completed";
  }
  const updatedShowtime = await ShowTime.findByIdAndUpdate(
    showtimeId,
    {
      $set: {
        showDateTime: showDateTime ?? showtime.showDateTime,
        status: finalStatus ?? showtime.status,
        price: price ?? showtime.price,
      },
    },
    { new: true }
  );
  if (!updatedShowtime) {
    throw new ApiErrors(500, "Failed to update showtime");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedShowtime, "Showtime updated successfully"));
});

const deleteShowtime = asyncHandler(async (req, res) => {
  const { showtimeId } = req.params;
  if (!isValidObjectId(showtimeId)) {
    throw new ApiErrors(400, "Invalid showtime Id");
  }
  const showtime = await ShowTime.findById(showtimeId);
  if (!showtime) {
    throw new ApiErrors(404, "Showtime not found");
  }
  if (req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admins can delete showtime");
  }
  const deletedShowtime = await ShowTime.findByIdAndDelete(showtimeId);
  if (!deletedShowtime) {
    throw new ApiErrors(500, "Failed to delete showtime");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Showtime deleted successfully"));
});

const getShowtime = asyncHandler(async (req, res) => {
  const { showtimeId } = req.params;
  if (!isValidObjectId(showtimeId)) {
    throw new ApiErrors(400, "Invalid showtime Id");
  }
  const showtime = await ShowTime.findById(showtimeId);
  if (!showtime) {
    throw new ApiErrors(404, "Showtime not found");
  }
  return res.status(200).json(new ApiResponse(200, showtime, "Showtime found"));
});

const getShowtimesforMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) {
    throw new ApiErrors(400, "Invalid movie Id");
  }
  const showtimes = await ShowTime.find({ movieId }).populate('screenId');
  return res
    .status(200)
    .json(new ApiResponse(200, showtimes, "Showtimes found"));
});

const getShowtimesforScreen = asyncHandler(async (req, res) => {
  const { screenId } = req.params;
  if (!isValidObjectId(screenId)) {
    throw new ApiErrors(400, "Invalid screen Id");
  }
  const showtimes = await ShowTime.find({ screenId });
  return res
    .status(200)
    .json(new ApiResponse(200, showtimes, "Showtimes found"));
});

const getShowtimesforTheater = asyncHandler(async (req, res) => {
  const { theaterId } = req.params;
  if (!isValidObjectId(theaterId)) {
    throw new ApiErrors(400, "Invalid theater Id");
  }
  const screens = await Screen.find({ theaterId });
  const screenIds = screens.map((screen) => screen._id);
  const showtimes = await ShowTime.find({ screenId: { $in: screenIds } });
  return res
    .status(200)
    .json(new ApiResponse(200, showtimes, "Showtimes found"));
});

const getAvailableShowtimes = asyncHandler(async (req, res) => {
  const showtimes = await ShowTime.find({ status: "Scheduled" });
  return res
    .status(200)
    .json(new ApiResponse(200, showtimes, "Showtimes found"));
});

export {
  addShowtime,
  updateShowtime,
  deleteShowtime,
  getShowtime,
  getShowtimesforMovie,
  getShowtimesforScreen,
  getShowtimesforTheater,
  getAvailableShowtimes,
};