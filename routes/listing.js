const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");



// Validate Listing
const validateListing = (req, res, next) => {
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







// Listings Routes

// Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings })
}));

// New Route (GET for form)
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
})

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing) {
     req.flash("error", "Listing doesn't exist!");
     return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

// Create Route (POST)
router.post("/", validateListing, wrapAsync(async (req, res, next) => {

  // Create a new listing instance and save it to the database
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");

}));

// Edit Route (GET for form)
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
     req.flash("error", "Listing doesn't exist!");
     return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// Update Route (PUT)
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  // Find the listing by ID and update it with the new data
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
   req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

// Delete Route (DELETE)

router.delete("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
 req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));

module.exports = router;