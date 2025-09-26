import review from "../models/reviewsModel.js";
import listing from "../models/listingModel.js";

export const createReview=async(req,res)=>{
    let Listing=await listing.findById(req.params.id);
    let listingReview=new review(req.body.review);
    // saving the user who is currently logged in
    listingReview.author=req.user._id;
    Listing.review.push(listingReview);

    await Listing.save();
    await listingReview.save();
    req.flash("success","New Review Created!");

    res.redirect(`/listings/${Listing._id}`)
}

export const deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};