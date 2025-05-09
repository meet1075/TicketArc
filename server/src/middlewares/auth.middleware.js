// export const verifyJWT = async (req, res, next) => {
//   try {
//     console.log("🔹 Cookies Received:", req.cookies);
//     console.log("🔹 Authorization Header:", req.header("authorization"));

//     const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized: User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("🔴 JWT Verification Failed:", error.message);
//     return res.status(401).json({ message: error?.message || "Invalid access token" });
//   }
// };



// // ✅ Admin Role Middleware (verifyAdmin)
// export const verifyAdmin = (req, res, next) => {
//   try {
//     if (req.user.role !== 'admin') {
//       throw new ApiErrors(403, "Forbidden: Admins only");
//     }
//     next(); // Proceed to next middleware/controller
//   } catch (error) {
//     next(error); // Forward any error to error handler
//   }
// };


// export const verifyUser = (req, res, next) => {
//   try {
//     if (req.user.role !== 'user') {
//       throw new ApiErrors(403, "Forbidden: Users only");
//     }
//     next(); // Proceed to next middleware/controller
//   } catch (error) {
//     next(error); // Forward any error to error handler
//   }
// };
// export const verifyRoles = (...allowedRoles) => (req, res, next) => {
//   try {
//     // Fix: Split the string into an actual array
//     const roleList = allowedRoles.flatMap(role => role.split(",")); 

//     console.log("Allowed Roles (Parsed):", roleList);
//     console.log("User Role from Request:", req.user?.role);

//     if (!req.user || !roleList.includes(req.user.role.trim())) {
//       throw new ApiErrors(403, `Forbidden: Allowed roles are ${roleList.join(", ")}`);
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };


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

    req.user = user;
    next();
  } catch (error) {
    console.error("🔴 JWT Verification Failed:", error.message);
    next(new ApiErrors(401, error.message || "Invalid access token"));
  }
};

export const verifyRoles = (...allowedRoles) => (req, res, next) => {
  try {
    const roleList = allowedRoles.flatMap(role => role.split(","));

    if (!req.user || !roleList.includes(req.user.role.trim())) {
      throw new ApiErrors(403, `Forbidden: Allowed roles are ${roleList.join(", ")}`);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ApiErrors(403, "Forbidden: Admins only");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyUser = (req, res, next) => {
  try {
    if (req.user.role !== 'user') {
      throw new ApiErrors(403, "Forbidden: Users only");
    }
    next();
  } catch (error) {
    next(error);
  }
};