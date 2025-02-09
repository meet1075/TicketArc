import mongoose, { Schema } from "mongoose";

const threaterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
    },
    screens: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen"
    }],
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
},{timestamps:true});

export const Threater = mongoose.model("Threater", threaterSchema);
// const screenCount = await Screen.countDocuments({ theaterId: theaterId });
//if want count of screen