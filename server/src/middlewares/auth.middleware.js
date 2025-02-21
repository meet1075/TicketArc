import jwt from "jsonwebtoken";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";


export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiErrors(401, "Unauthorized: No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiErrors(401, "Unauthorized: User not found");
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid access token");
  }
};

// ✅ Admin Role Middleware (verifyAdmin)
export const verifyAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ApiErrors(403, "Forbidden: Admins only");
    }
    next(); // Proceed to next middleware/controller
  } catch (error) {
    next(error); // Forward any error to error handler
  }
};


export const verifyUser = (req, res, next) => {
  try {
    if (req.user.role !== 'user') {
      throw new ApiErrors(403, "Forbidden: Users only");
    }
    next(); // Proceed to next middleware/controller
  } catch (error) {
    next(error); // Forward any error to error handler
  }
};
export const verifyRoles = (...allowedRoles) => (req, res, next) => {
  try {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiErrors(403, `Forbidden: Allowed roles are ${allowedRoles.join(", ")}`);
    }
    next();
  } catch (error) {
    next(error);
  }
};
