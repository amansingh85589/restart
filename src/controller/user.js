import { asyncHandler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/clouudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        console.log("Generating tokens for:", user.username);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken(); // ✅ Ensure this is correct

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (err) {
        console.error("JWT Token Generation Error:", err);
        throw new ApiError(500, "Error while generating the access and refresh token");
    }
};


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullname } = req.body;

    if (!email || !username || !password || !fullname) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    try {
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        let coverImage = null;
        if (coverImageLocalPath) {
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
        }

        const user = await User.create({
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),
            fullname,
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "Error while registering the user");
        }

        return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
    } catch (error) {
        console.error("Cloudinary or other error:", error);
        throw new ApiError(500, "Error during file upload or user creation");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
        throw new ApiError(400, "Email/Username and password are required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new ApiError(404, "User does not exist, register first");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: true };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });

    const options = { httpOnly: true, secure: true };

    return res.status(200)
        .cookie("accessToken", "", options)
        .cookie("refreshToken", "", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});




const refreshAccessToken = asyncHandler(async(req, res)=>{


   const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

   if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request ")
    
   }

   try {
    const decordedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
 
 
 
 
 
    const user = await User.findById(decordedToken?._id)
    if (!user) {
     throw new ApiError(401, "invalid refress token ")
     
    }
 
    if (incomingRefreshToken !== user?.refreshToken) {
     throw new ApiError(400, "refresh token is expired or already used")
 
 
 
     
    }
    const options= {
 
     httpOnly:true,
     secure:true
    }
 
    const {accessToken, newrefreshToken} =await generateAccessAndRefreshToken(user._id)
 
   return res.status(200).cookie("access token", accessToken, options).cookie("refresh token", newrefreshToken, options).json(
     new ApiResponse(
         200,
         {accessToken, refreshToken:newrefreshToken},
         "access token refreshed "
 
     )
   )
   } catch (error) {
    throw new ApiError(401, error?.message || "invaled reffresh token")
    
   }

})



const changeCurrentPassword = asyncHandler(async(req, res)=>{


    const {oldPassword, newPassword}= req.body

    const user = await User.findById(req.user?._id)

    const  isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(401, "password is in correct")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})


    return res.status(200).json(new ApiResponse (200,{}, "PASSWORD UPDATES SUCCESSFULLY"))

})

// const updateEmail = asyncHandler(async(req, res)=>{


//     const {updateEmail} = req.body;
//     const user = await User.findById(req.user?._id)
//     if(!updateEmail){

//         throw new ApiError (404, "please enter an email")
//     }


//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(updateEmail)) {
//         throw new ApiError(400, "Invalid email format");
//     }
//     user.email = updateEmail
//     await user.save({validateBeforeSave:false})
//     return res.status(200).json(new ApiResponse (200,{}, "email UPDATES SUCCESSFULLY"))



// });



const updateAccountDetails = asyncHandler(async (req, res) => {
    const { updatedUserName, updateEmail } = req.body;
  
    if (!(updatedUserName || updateEmail)) {
      throw new ApiError(400, "Please enter a username or email.");
    }
  
    // ✅ Validate email format
    if (updateEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateEmail)) {
        throw new ApiError(400, "Invalid email format.");
      }
    }
  
    // ✅ Correcting findByIdAndUpdate syntax
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      
      {
        $set: {
          userName: updatedUserName, // ✅ Changed userName → username
          email: updateEmail,
        },
      },
      { new: true, runValidators: true  } // ✅ Moved inside function call
    ).select("-password");
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    return res.status(200).json(new ApiResponse(200, user, "Account updated successfully"));
  });
  


const getCurrentUser = asyncHandler(async(req, res)=>{

    return re
    .status(200)
    .json(200, {}, "current user featched succesfully")
});



const updateUserAvatar = asyncHandler(async(req, res)=>{

const avatarLocalPath = req.file?.path

if(!avatarLocalPath){

    throw new ApiError (400, "please uplate a avatar pictire to upade ")



}


const avatar = await uploadOnCloudinary(avatarLocalPath)

if(!avatar.url){

    throw new ApiError(400,"error while uploading ")
}


const user = await User.findByIdAndUpdate(req.User?._id,{
    $set:{
        avatar: avatar.url
    }
},{new: true}).select("-password")

return res.status(200).json( new ApiResponse (200, user," avaatr image updated" ))




})


const updateUserCoverImage = asyncHandler(async(req, res)=>{

    const coverImageLocalPath = req.file?.path
    
    if(!coverImageLocalPath){
    
        throw new ApiError (400, "please uplate a cover pictire to upade ")
    
    
    
    }
    
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if(!coverImage.url){
    
        throw new ApiError(400,"error while uploading cover iamge ")
    }
    
    
    const user = await User.findByIdAndUpdate(req.User?._id,{
        $set:{
            coverImage: coverImage.url
        }
    },{new: true}).select("-password")


    return res.status(200).json( new ApiResponse (200, user," cover image updated" ))
    
    
    
    
    });




    














export { registerUser, 
     loginUser, 
     logOutUser,
     refreshAccessToken,
     changeCurrentPassword,
      getCurrentUser, 
      updateAccountDetails,
      updateUserAvatar,
      updateUserCoverImage,
    
    
    };






