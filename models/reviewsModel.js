import mongoose from "mongoose";

let reviewSchema = new mongoose.Schema({
    username: String,
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // this is the author of review who creates it
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})

let Review = mongoose.model("Review", reviewSchema);
export default Review;