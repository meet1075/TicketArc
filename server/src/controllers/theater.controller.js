import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Theater} from "../models/theater.model.js"
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
export{
    addTheater ,
    deleteTheater,
    updateTheater,
    getTheaterById,
    getAllTheater,
    searchTheaters,
    // addScreenToTheater,
    // removeScreenFromTheater,
    // getTheatersWithScreenDetails
}