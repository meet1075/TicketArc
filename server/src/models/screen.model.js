import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const screenSchema = new Schema({
    screenNumber: {
        type: Number,
        required: true
    },
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theater",
        required: true
    },
    screenType: {
        type: String,
        enum: ["2D", "3D"],
        default: "2D"
    },
    totalSeats: {
        type: Number,
        required: true
    },
    numberOfRows: {
        type: Number,
        required: true
    },
    numberOfColumns: {
        type: Number,
        required: true
    },
    // seats: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Seat"
    // }]
},{timestamps:true});
screenSchema.plugin(mongooseAggregatePaginate);
export const Screen = mongoose.model("Screen", screenSchema);
