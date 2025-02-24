// import { Router } from "express";
// import registerUser from "../controller/user.js";
// import { upload } from "../middlewares/multer.middleware.js";

// const router = Router();
// router.post("/register", (req, res, next) => {
//     console.log("🟢 /register route hit");

//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         },
//         {
//             name: "coverImage",  // Fixed the syntax here
//             maxCount: 1
//         }
//     ])(req, res, next);  // Call the middleware function properly
// }, registerUser);

// export default router;
import { Router } from "express";
import {loginUser, registerUser} from "../controller/user.js";
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


router.route("/logout").post(verifyJWT, logoutUser)

export default router;