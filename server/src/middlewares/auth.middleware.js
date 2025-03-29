import jwt from "jsonwebtoken";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";

// verifyJWT Middleware
export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");

        if (!token) {
            return next(new ApiErrors(401, "Unauthorized: No token provided"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return next(new ApiErrors(401, "Unauthorized: User not found"));
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiErrors(401, error?.message || "Invalid access token"));
    }
};

// verifyAdmin Middleware
export const verifyAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return next(new ApiErrors(403, "Forbidden: Admins only"));
        }
        next();
    } catch (error) {
        next(error);
    }
};

// verifyUser Middleware
export const verifyUser = (req, res, next) => {
    try {
        if (req.user.role !== 'user') {
            return next(new ApiErrors(403, "Forbidden: Users only"));
        }
        next();
    } catch (error) {
        next(error);
    }
};

// verifyRoles Middleware
export const verifyRoles = (...allowedRoles) => (req, res, next) => {
    try {
        const roleList = allowedRoles.flatMap(role => role.split(","));
        if (!req.user || !roleList.includes(req.user.role.trim())) {
            return next(new ApiErrors(403, `Forbidden: Allowed roles are ${roleList.join(", ")}`));
        }
        next();
    } catch (error) {
        next(error);
    }
};
