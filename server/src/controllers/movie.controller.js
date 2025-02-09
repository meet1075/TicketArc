import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose ,{isValidObjectId}from 'mongoose'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { Movie } from "../models/movie.model.js";
import { User } from "../models/user.model.js";
import fs from "fs";    

const addMovie=asyncHandler(async(req,res)=>{
    
})
export {
    addMovie,
    deleteMovie,
    updateMovie,
    getMovieById,
    getAllMovies,
}