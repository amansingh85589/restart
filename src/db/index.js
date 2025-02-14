
// import express from "express";
// const app = express();

// import dotenv from "dotenv";

// import { DB_NAME } from "./constant";

// dotenv.config();

// ;(async()=>{


//     try {

//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//        app.on("error", (error)=>{
//         console.log(error)
//         throw error;
        
//        })


//        app.listen(process.env.PORT,()=>{

//         console.log(`app is running express is connect to db via ${process.env.PORT}`)
//          });
        
//     } catch (error) {
//         console.error(error)
//         throw error
        
//     }
// })()



import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async ()=>{

    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/ ${DB_NAME}`);

        console.log(connectInstance.connection.host);
        

        
    } catch (error) {
        console.error(error)
        process.exit(1)
        
    }


}

export default connectDB
