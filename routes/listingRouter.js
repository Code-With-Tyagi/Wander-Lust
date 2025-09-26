import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {isLoggedIn} from "../middleware.js";
import { isOwner } from "../middleware.js";
import { validateListing } from "../middleware.js";
import * as listingController from "../controllers/listingController.js";
import multer from "multer";
import {storage} from "../cloudConfig.js";
const upload = multer({ storage });

const router=express.Router();


// index route
router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new",isLoggedIn,listingController.newForm);

// Create Route
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

// update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing));

// delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

// show route
router.get("/:id", wrapAsync(listingController.showListing));

export default router;