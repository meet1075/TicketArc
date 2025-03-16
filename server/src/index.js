// import mongoose from "mongoose"
import 'dotenv/config';

import connectDB from "./db/index.js";
import {app} from "./app.js";
import "./utils/cron.js"


connectDB()
.then(()=>{                      
        app.listen(process.env.PORT||8000,()=>{
            console.log(`server running at port : ${process.env.PORT}`)
        })
    }
)
.catch((err)=>{
    console.log("MONGODB connection failed",err)
})

