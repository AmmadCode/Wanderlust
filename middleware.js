const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema,  reviewSchema  } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
  if (!req.isAuthenticated()) {
    //redirect url save
   req.session.redirectUrl = req.path.includes('/reviews/') 
  ? `/listings/${req.params.id}` 
  : req.originalUrl;
    req.flash("error", "You must be logged in to do that!");
    return res.redirect("/login");
  }
  next();
};
// Middleware to set redirectUrl in res.locals
module.exports.redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Middleware to check if the user is the owner of the listing
module.exports.isOwner = async (req,res, next) => {
  // Check if the user is logged in
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)) {
      req.flash("error", "You are not the owner of this listing!");
      return res.redirect(`/listings/${id}`);
    }

    next();
  
}

// Validate Listing
module.exports.validateListing = (req, res, next) => {
  // Validate request body using Joi schema (with type coercion enabled for price field)
  const { error } = listingSchema.validate(req.body, {
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


// validate Review
module.exports.validateReview = (req, res, next) => {
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

// Middleware to check if the user is the author of the review
// This middleware should be used before routes that modify or delete reviews
module.exports.isReviewAuthor = async (req,res,next) => {
  const { id,reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }
  if(!review.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}