import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from 'mongoose';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Movie } from "../models/movie.model.js";
import fs from "fs";

const addMovie = asyncHandler(async (req, res) => {
    const { title, description, releaseDate, duration, genre, language } = req.body;

    if (
        [title, description, releaseDate, duration, genre, language].some((field) => !field?.trim())
    ) {
        throw new ApiErrors(400, "All fields are required");
    }

    if (req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admins can add movies");
    }

    // console.log("Uploaded Files:", req.files);
    const movieLocalPath = req.file?.path || req.files?.movieImage?.[0]?.path;


    if (!movieLocalPath) {
        throw new ApiErrors(400, "Movie image file is required");
    }
    // console.log(movieLocalPath)

    const movieImage = await uploadOnCloudinary(movieLocalPath);
    // console.log(movieImage)
    if (!movieImage) {
        throw new ApiErrors(400, "Error while uploading movie image");
    }

    const movie = await Movie.create({
        title,
        description,
        releaseDate,
        duration,
        genre,
        language,
        movieImage: movieImage.secure_url,
        adminId: req.user._id, 
    });

    if (!movie) {
        throw new ApiErrors(500, "Something went wrong while adding the movie");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, movie, "Movie added successfully"));
});

const deleteMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    if (!isValidObjectId(movieId)) {
        throw new ApiErrors(400, "Invalid movie ID");
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
        throw new ApiErrors(404, "No movie found");
    }

    if (req.user.role !== "admin" || movie.adminId.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to delete this movie");
    }

    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (!deletedMovie) {
        throw new ApiErrors(500, "Failed to delete movie");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Movie deleted successfully"));
});

const updateMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const { title, description, releaseDate, duration, genre, language } = req.body;

    if (!isValidObjectId(movieId)) {
        throw new ApiErrors(400, "Invalid movie ID");
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
        throw new ApiErrors(404, "Movie not found");
    }

    if (req.user.role !== "admin" || movie.adminId.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to update this movie");
    }

    let movieImage;
    if (req.file) {
        const movieLocalPath = req.file.path;
        movieImage = await uploadOnCloudinary(movieLocalPath);

        if (!movieImage.url) {
            throw new ApiErrors(400, "Error while uploading movie image");
        }
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
        movieId,
        {
            $set: {
                title: title || movie.title,
                description: description || movie.description,
                releaseDate: releaseDate || movie.releaseDate,
                duration: duration || movie.duration,
                genre: genre || movie.genre,
                language: language || movie.language,
                movieImage: movieImage?.url || movie.movieImage, 
            },
        },
        { new: true }
    );

    if (!updatedMovie) {
        throw new ApiErrors(500, "Failed to update movie");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedMovie, "Movie updated successfully"));
});


const getMovieById = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    if (!isValidObjectId(movieId)) {
        throw new ApiErrors(400, "Invalid movie ID");
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
        throw new ApiErrors(404, "Movie not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, movie, "Movie fetched successfully"));
});

const getAllMovies = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, genre, language } = req.query;

    const pipeline = [];

    if (query) {
        pipeline.push({
            $search: {
                index: "search-movies", 
                text: {
                    query: query,
                    path: ["title", "description"],
                },
            },
        });
    }

    if (genre) {
        pipeline.push({
            $match: {
                genre: genre,
            },
        });
    }

    if (language) {
        pipeline.push({
            $match: {
                language: language,
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
        pipeline.push({ $sort: { releaseDate: -1 } });
    }

    const movieAggregate = Movie.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const movies = await Movie.aggregatePaginate(movieAggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, movies, "Movies fetched successfully"));
});

export {
    addMovie,
    deleteMovie,
    updateMovie,
    getMovieById,
    getAllMovies,
};