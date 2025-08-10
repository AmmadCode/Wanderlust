const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview,isLoggedIn, isReviewAuthor } = require("../middleware.js");

// Reviews Routes
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // Set the author of the review to the logged-in user
    listing.reviews.push(review);
    await review.save();
    // Save the updated listing with the new review
    await listing.save();
    req.flash("success", "Review Created!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
