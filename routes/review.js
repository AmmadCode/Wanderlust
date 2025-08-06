const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require("../models/review.js");
const {  reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");


// validate Review
const validateReview = (req, res, next) => {
  // Validate request body using Joi schema
 const { error } = reviewSchema.validate(req.body, {
    allowUnknown: false,  // Don't allow unknown fields
    stripUnknown: false   // Don't strip unknown fields, show error instead
  });

  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }

}








// Reviews Routes
router.post("/", validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const listing = await Listing.findById(id);
  const review = new Review(req.body.review);
  listing.reviews.push(review);
  await review.save();
  // Save the updated listing with the new review
  await listing.save();
  req.flash("success", "Review Created!");
  res.redirect(`/listings/${id}`);
}));

// Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;






















