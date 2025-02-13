import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Theater} from "../models/theater.model.js"
import { Screen } from "../models/screen.model.js";
import mongoose, { isValidObjectId } from 'mongoose';

const addTheater = asyncHandler(async (req, res) => {
    const { name, location } = req.body;

    if (!name || !location || !location.city || !location.state) {
        throw new ApiErrors(400, "Name, city, and state are required");
    }

    if (req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admins can add theater");
    }

    const theater = await Theater.create({
        name,
        location,
        screens: [], // Empty array
        adminId: req.user._id,
    });

    return res
    .status(201)
    .json(new ApiResponse(201,theater,"theater added successfully"))
});
const deleteTheater= asyncHandler(async(req,res)=>{
    const {theaterId}= req.params
    if(!isValidObjectId(theaterId)){
        throw new ApiErrors(400,"invalid theater Id")
    }
    const theater= await Theater.findById(theaterId)
    if(!theater){
        throw new ApiErrors(404,"no theater found")
    }
    if (req.user.role !== "admin" || theater.adminId.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to delete this theater");
    }
    const deletedTheater= await Theater.findByIdAndDelete(theaterId)
    
    if (!deletedTheater) {
        throw new ApiErrors(500, "Failed to delete theater");
    }
    return res.
    status(200)
    .json(new ApiResponse(200,{},"Theater deleted successfully"))
})  

const updateTheater = asyncHandler(async (req, res) => {
    const { theaterId } = req.params;
    const { name, location, screens } = req.body; // Added screens

    if (!isValidObjectId(theaterId)) {
        throw new ApiErrors(400, "Invalid theater Id");
    }

    const theater = await Theater.findById(theaterId);
    if (!theater) {
        throw new ApiErrors(404, "Theater not found");
    }

    if (req.user.role !== "admin" || theater.adminId.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to update this theater");
    }

    const updatedTheater = await Theater.findByIdAndUpdate(
        theaterId, 
        {
            $set: {
                name: name ?? theater.name, 
                location: location ?? theater.location, 
                screens: screens ?? theater.screens, 
            }
        },
        { new: true }
    );

    if (!updatedTheater) {
        throw new ApiErrors(500, "Failed to update theater");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTheater, "Theater updated successfully"));
});

const getTheaterById= asyncHandler(async(req,res)=>{
    const {theaterId}=req.params
    if(!isValidObjectId(theaterId)){
        throw new ApiErrors(400,"Invalid theater Id")
    }
    const theater=await Theater.findById(theaterId);

    if(!theater){
        throw new ApiErrors(404,"Theater not found"); 
    }
    return res
    .status(200)
    .json(new ApiResponse(200,theater,"Theater fetched successfully"))
})

const getAllTheater = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, city, state, sortBy, sortType } = req.query;

    const pipeline = [];

    if (city) {
        pipeline.push({
            $match: {
                "location.city": city,
            },
        });
    }

    if (state) {
        pipeline.push({
            $match: {
                "location.state": state,
            },
        });
    }

    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
            },
        });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    const theaterAggregate = Theater.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const theaters = await Theater.aggregatePaginate(theaterAggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, theaters, "Theaters fetched successfully"));
});
const searchTheaters = asyncHandler(async (req, res) => {
    const { query, city, state, page = 1, limit = 10 } = req.query;

    if (!query && !city && !state) {
        throw new ApiErrors(400, "At least one search parameter (query, city, or state) is required");
    }

    const pipeline = [];

    if (query) {
        pipeline.push({
            $match: {
                $text: { $search: query },
            },
        });
    }

    if (city) {
        pipeline.push({
            $match: {
                "location.city": city,
            },
        });
    }

    if (state) {
        pipeline.push({
            $match: {
                "location.state": state,
            },
        });
    }

    const theaterAggregate = Theater.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const theaters = await Theater.aggregatePaginate(theaterAggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, theaters, "Theaters fetched successfully"));
});
 const addScreenToTheater= asyncHandler(async(req,res)=>{
    const{theaterId}=req.params
    const {screenNumber,screenType, totalSeats} = req.body
    if(!isValidObjectId(theaterId)){
        throw new ApiErrors(404,"Invalid Theater id")
    }
    const theater= await Theater.findById(theaterId)
    if(!theater){
        throw new ApiErrors(404,"no theater found")
    }
    if (!screenNumber || !screenType || !totalSeats) {
        throw new ApiErrors(400, "All fields are required");
    }
    if (req.user.role !== "admin" || theater.adminId.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to add screen to  this theater");
    }
    const screen=await Screen.create({
        screenNumber,
        screenType,
        totalSeats,
        theaterId
    })
    theater.screens.push(screen._id);
    await theater.save();
    return res
    .status(200)
    .json(new ApiResponse(200, screen,"screen added successfully "))
 })
const removeScreenFromTheater = asyncHandler(async (req, res) => {
    const { theaterId, screenId } = req.params;

    if (!isValidObjectId(theaterId) || !isValidObjectId(screenId)) {
        throw new ApiErrors(400, "Invalid Theater ID or Screen ID");
    }

    const theater = await Theater.findById(theaterId);
    if (!theater) {
        throw new ApiErrors(404, "Theater not found");
    }

    const screen = await Screen.findById(screenId);
    if (!screen) {
        throw new ApiErrors(404, "Screen not found");
    }
    // Check if the screen belongs to the given theater
    if (screen.threaterId.toString() !== theaterId) {
        throw new ApiErrors(400, "Screen does not belong to the specified theater");
    }

    if (req.user.role !== "admin" || theater.adminId.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to remove a screen from this theater");
    }

    // Remove the screen from the Theater's screens array
    theater.screens = theater.screens.filter(id => id.toString() !== screenId);
    await theater.save(); //check if array is updated

    const deletedScreen=await Screen.findByIdAndDelete(screenId);
    if (!deletedScreen) {
        throw new ApiErrors(500, "Failed to delete screen");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Screen removed successfully"));
});
const getTheatersWithScreenDetails=asyncHandler(async(req,res)=>{
    const{theaterId}=req.params

    if(!isValidObjectId(theaterId)){
        throw new ApiErrors(404,"Invalid Theater id")
    }
    const theaterWithScreenDetails= await Theater.aggregate([
        { 
             $match:{
                _id: new mongoose.Types.ObjectId(theaterId)
            }
        },
        {
            $lookup:{
                from: "screens", 
                localField: "screens",
                foreignField: "_id",
                as: "screenDetails"
            }

        },
        {
            $project:{
                screens:0,
                "screenDetails.seats": 0
            }
        }
    ])
})
export{
    addTheater ,
    deleteTheater,
    updateTheater,
    getTheaterById,
    getAllTheater,
    searchTheaters,
    addScreenToTheater,
    removeScreenFromTheater,
    getTheatersWithScreenDetails
}