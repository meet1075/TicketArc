import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const theaterSchema = new Schema({
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
theaterSchema.index({ name: "text", "location.city": "text", "location.state": "text" });

theaterSchema.plugin(mongooseAggregatePaginate)

export const Theater = mongoose.model("Theater", theaterSchema);

