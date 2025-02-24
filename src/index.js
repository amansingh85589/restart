import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";  // Import app from app.js
import connectDB from "./db/index.js";

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ MongoDB connection failed:", err);
    });
