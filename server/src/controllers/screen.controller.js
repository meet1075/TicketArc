import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Theater} from "../models/theater.model.js" 
import { Screen } from "../models/screen.model.js";
import mongoose, { isValidObjectId } from 'mongoose';
const updateScreen= asyncHandler(async(req,res)=>{
    const{screenId}=req.params
    const{screenNumber,screenType,totalSeats}=req.body
    if(!isValidObjectId(screenId)){
        throw new ApiErrors(404,"Invalid ScreeenId")
    }
    const screen= await Screen.findById(screenId);
    if(!screen){
        throw new ApiErrors(400,"Screen not found")
    }
    if(req.user.role!=="admin"){
        throw new ApiErrors(404,"only admin can update screen")
    }
    const updatedScreen=await Screen.findByIdAndUpdate(
        screenId,
        {
            $set:{
                screenNumber:screenNumber??screen.screenNumber,
                screenType:screenType??screen.screenType,
                totalSeats:totalSeats??screen.totalSeats,
            }
        },
        {
            new:true
        }
    )
    if(!updatedScreen){
        throw new ApiErrors(404,"Screen updation failed")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,updatedScreen,"Screen updated successfully"))
})
const getScreenById=asyncHandler(async(req,res)=>{
    const{screenId}=req.params
    if(!isValidObjectId(screenId)){
        throw new ApiErrors(404,"Invalid ScreenId")
    }
    const screen=await Screen.findById(screenId);
    if(!screen){
        throw new ApiErrors(404,"Screen not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,screen,"Screen fetched successfully"))
})
const getAllScreen = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, screenType, sortBy, sortType } = req.query;
    
    let pipeline = [];

    if (screenType) {
        pipeline.push({
            $match: {
                screenType: screenType
            }
        });
    }

    if (sortBy) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        });
    } else {
        pipeline.push({
            $sort: {
                createdAt: -1
            }
        });
    }

    pipeline.push({
        $project: {
            _id: 1, 
            screenNumber: 1,
            theaterId: 1,
            screenType: 1,
            totalSeats: 1,
            createdAt: 1,
            updatedAt: 1
        }
    });

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const screens = await Screen.aggregatePaginate(Screen.aggregate(pipeline), options);

    return res.status(200).json(new ApiResponse(200, screens, "Screens fetched successfully"));
});

const searchScreen = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, screenType } = req.query;

    if (!screenType) {
        throw new ApiErrors(400, "screenType is required");
    }

    const pipeline = [
        {
            $match: {
                screenType: screenType
            }
        },
        {
            $project: {
                _id: 1,
                screenNumber: 1,
                theaterId: 1,
                screenType: 1,
                totalSeats: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const screens = await Screen.aggregatePaginate(Screen.aggregate(pipeline), options);

    return res.status(200).json(new ApiResponse(200, screens, "Screens fetched successfully"));
});

export{
    updateScreen,
    getScreenById,
    getAllScreen,
    searchScreen//based on screen type
}