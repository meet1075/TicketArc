import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        console.log(process.env.MONGODB_URI)
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`\nMONGODB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection Error", error);
        process.exit(1);
        
    }
}
export default connectDB;