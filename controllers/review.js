const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
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
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
