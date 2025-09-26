import mongoose from "mongoose";

import listing from "../models/listingModel.js";
import sampleListings from "./data.js";

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

main()
.then(()=>{
    console.log("connection established sucessfully");
})
.catch((err)=>{
    console.log(err);
});

async function initDatabase(){
    await listing.deleteMany();
    const listings=sampleListings.map((obj)=>({...obj,owner:"68c940ddef995b0b954e6b5d"}))
    await listing.insertMany(listings);
    console.log("data saved sucessfully");
}

initDatabase();