import mongoose from "mongoose";

import dotenv from 'dotenv';

dotenv.config();

const DB = process.env.db_url;

mongoose.connect(DB).then(()=>{
    console.log("Database Connected");
}).catch((error)=>{
    console.log("error");
});