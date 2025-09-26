import listing from "../models/listingModel.js";

export const index=async (req, res) => {
    let {category}=req.query;
    let filter={};
    if(category){
        filter.category=category;
    }
    let listings = await listing.find(filter);
    res.render("listings/index.ejs", { listings });
}

export const newForm=(req, res) => {
    res.render("listings/new.ejs");
}

export const createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    let Listing = req.body.listing;
    let newListing = new listing(Listing);
    // this line is to save the user who currently login and create a listing
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!"); // this is used to create the flash message
    res.redirect("/listings");
};

export const editListing=async (req, res) => {
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if(!Listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { Listing });
};

export const updateListing=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    let { id } = req.params;
    let Listing = req.body.listing;
    Listing.image={url,filename};
    await listing.findByIdAndUpdate(id, Listing);
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

export const deleteListing=async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

export const showListing=async (req, res) => {
    let { id } = req.params;
    let singleListing = await listing.findById(id).populate("review").populate("owner");
    if(!singleListing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { singleListing });
};
