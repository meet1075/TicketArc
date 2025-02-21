import { asyncHandler } from "../utils/asyncHandler.js";
import{ApiErrors} from "../utils/ApiErrors.js";
import{ApiResponse} from "../utils/ApiResponse.js";
import{Showtime} from "../models/showtime.model.js";
import{Movie} from "../models/movie.model.js";
import{Screen} from "../models/screen.model.js";
import mongoose, { isValidObjectId } from 'mongoose';
import { Theater } from "../models/theater.model.js";
const addShowtime = asyncHandler(async (req, res) => {
        
})

export {
    addShowtime,
    updateShowtime,
    deleteShowtime,
    getShowtime,
    getShowtimesforMovie,
    getShowtimesforScreen,
    getShowtimesforTheater,
    getAvailableShowtimes
}