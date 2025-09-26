import express from "express";
const router = express.Router();

import wrapAsync from "../utils/wrapAsync.js";

import { isLoggedIn, validateReview ,isReviewAuthor} from "../middleware.js";
import * as reviewController from "../controllers/reviewController.js";


// review show route
router.post("/:id/reviews",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

// review delete route
router.delete("/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

export default router;