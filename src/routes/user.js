

import { Router } from "express";

import { loginUser, registerUser, logOutUser, refreshAccessToken, 
    changeCurrentPassword, getCurrentUser, updateAccountDetails,
     updateUserAvatar, updateUserCoverImage, getUserChannelProfile,
      getWatchHistory } from "../controller/user.js";

// import {loginUser, registerUser} from "../controller/user.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.post(
    "/register",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);

router.route("/login").post(loginUser)



// secure routs


router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)


router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)


router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

Router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"), updateUserCoverImage)


Router.route("/c/:username").get(verifyJWT, getUserChannelProfile)


router.route("/history").get(verifyJWT,getWatchHistory)


export default router;