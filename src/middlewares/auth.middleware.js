import Jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";

import { User } from "../models/user.model.js";


export const varifyJWT = asyncHandler(async(req, res, next)=>{



   try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
    if (!token) {throw new ApiError(404, "unauthorized access")
     
    }
 
 
 
    const decordedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
    const user =await User.findById(decordedToken?._id).select("-password -refreshToken")
 
    if (!user) {
 
 
     // work neend to e done 
     throw new ApiError(401, "invalid access taken error")
     
    }
 
 
    req.user = user;
    next()
   } catch (error) {

    throw new ApiError (401, error?.message || "invalid access token")
    
   }


});