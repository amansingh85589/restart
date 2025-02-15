import { Router } from "express";
import registerUser from "../controller/user.js";

const router = Router();

router.post("/register", (req, res, next) => {
    console.log("🟢 /register route hit");  // Debugging log
    next();
}, registerUser);

export default router;
