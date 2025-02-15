import { asyncHandler } from "../utils/asyncHandeler.js";

const registerUser = asyncHandler(async (req, res) => {
    console.log("Register route hit");  // Debugging log
    res.status(200).json({ message: "ok" });
});

export default registerUser;
