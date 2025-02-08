import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true, 
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    genre: {
      type: [String],
      required: true,
      index: true, 
    },
    releaseDate: {
      type: Date,
      required: true,
      index: true
    },
    language: {
      type: String,
      required: true,
      index: true
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
  },
  { timestamps: true }
);


movieSchema.index({ genre: 1, releaseDate: -1 });
movieSchema.plugin(mongooseAggregatePaginate)

export const Movie = mongoose.model("Movie", movieSchema);
