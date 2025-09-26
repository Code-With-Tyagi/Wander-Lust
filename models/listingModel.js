import mongoose from "mongoose";
import review from "./reviewsModel.js";
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    // this is the owner of the listing who is logged in
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["Trending","Rooms","Iconic Cities","Mountains","Camping","Pools","Farms","Arctic","Beach","Domes"],
        required:true
    }

});

// MONGOOSE MIDDLEWARE
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.review } });
    }
})
const listing = mongoose.model("listing", listingSchema);
export default listing;