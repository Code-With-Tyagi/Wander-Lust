import listing from "./models/listingModel.js";
import review from "./models/reviewsModel.js";
import ExpressError from "./utils/ExpressError.js";
import schemas from "./joi schema/schema.js";
const { listingSchema, reviewSchema } = schemas;


export const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }
    else {
        next();
    }
}

export const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }
    else{
        next();
    }
}

export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // originalUrl is the path which the user wants to reach before login
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in");
        return res.redirect("/login");
    }
    next();
};

export const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

export const isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

export const isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let Review = await review.findById(reviewId);
    if (!Review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }
    if (!Review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
