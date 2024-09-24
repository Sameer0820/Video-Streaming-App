import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const checkUser = asyncHandler(async (req, _, next) => {
    try {
        const token =
            // req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            );

            if (!decodedToken) {
                next();
            }

            const user = await User.findById(decodedToken?._id).select(
                "-password -refreshToken"
            );

            if (!user) {
                next();
            }

            req.user = user;
        }
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
