import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiErrors} from '../utils/ApiErrors.js'
import{ApiResponse} from "../utils/ApiResponse.js"
import {User} from '../models/user.model.js'
import { Booking } from '../models/booking.model.js'; // Add this line
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiErrors(500, "Something went wrong while generating refresh and access token");
    }
};

const register = asyncHandler(async (req, res) => {
    const { fullName, userName, password, email, role } = req.body;

    if ([fullName, userName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiErrors(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { userName }]
    });
    if (existedUser) {
        throw new ApiErrors(409, "User already exists");
    }

    let assignedRole = "user"; // Default role is "user"

    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount === 0) {
        assignedRole = "admin";
    }

    
    if (role === "admin") {
        if (!req.user || req.user.role !== "admin") {
            throw new ApiErrors(403, "Only admins can create another admin");
        }
        assignedRole = "admin";
    }

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
        role: assignedRole
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiErrors(500, "Something went wrong while registering the user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const login = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body;

    if (!(userName || email)) {
        throw new ApiErrors(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    });

    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
        throw new ApiErrors(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    req.user = { id: user._id, role: user.role };

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        
    };
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ 
        success: true,
        user: loggedInUser,
        accessToken, 
        refreshToken
    });


     
});

const logout= asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user?._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {new:true}
    )
    const options = {
        httpOnly:true,
        secure:true
     }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{}, "user logged out successfully")) 
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
console.log("error",incomingRefreshToken)
    if (!incomingRefreshToken) {
        throw new ApiErrors(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiErrors(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiErrors(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid refresh token");
    }
});
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Current user fetched successfully"));
});
const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body
    if(!(fullName||email)){
        throw new ApiErrors(404,"fullname or email is required")
    }
    const updatedUserDetails = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                fullName,
                email
            }
        },
        {
            new:true
        }
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200,updatedUserDetails,"user details updated successfully"))
})
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user?._id)
    const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiErrors(404,"invalid password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:true})
    return res
    .status(200)
    .json(new ApiResponse(200,{}, "password changed successfully"))
})
const bookingHistory = asyncHandler(async (req, res) => {
    const userBookings = await Booking.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "showtimes",
                localField: "showtimeId",
                foreignField: "_id",
                as: "showtimeDetails"
            }
        },
        { $unwind: "$showtimeDetails" },
        {
            $lookup: {
                from: "movies",
                localField: "movieId",
                foreignField: "_id",
                as: "movieDetails"
            }
        },
        { $unwind: "$movieDetails" },
        {
            $lookup: {
                from: "screens",
                localField: "screenId",
                foreignField: "_id",
                as: "screenDetails"
            }
        },
        { $unwind: "$screenDetails" },
        {
            $lookup: {
                from: "theaters",
                localField: "theaterId",
                foreignField: "_id",
                as: "theaterDetails"
            }
        },
        { $unwind: "$theaterDetails" },
        {
            $project: {
                _id: 1,
                movie: {
                    title: "$movieDetails.title",
                    movieImage: "$movieDetails.movieImage"
                },
                showtime: {
                    dateTime: "$showtimeDetails.showDateTime",
                    screen: "$screenDetails.screenNumber"
                },
                theater: {
                    name: "$theaterDetails.name",
                    location: "$theaterDetails.location.city"
                },
                seats: "$seats",
                totalAmount: 1,
                bookingStatus: 1,
                bookingTime: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, userBookings, "Booking history fetched successfully")
    );
});

export {
    register,
    login,
    logout,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    changeCurrentPassword,
    bookingHistory
}