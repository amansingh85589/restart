import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.js";  

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Log every request
app.use((req, res, next) => {
    console.log(`🔴 Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Test root route
app.get("/", (req, res) => {
    console.log("✅ Root Route Hit");
    res.send("Server is working!");
});

// Register user routes
app.use("/api/v1/users", userRouter);

export { app };
