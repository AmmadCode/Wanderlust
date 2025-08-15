const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig");
const { geocodeAddress } = require("../utils/geocoding");

module.exports.index = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Handle search by country
    if (search) {
      query.country = { $regex: search, $options: 'i' };
    }

    // Handle category filter
    if (category) {
      query.category = category;
    }

    const allListings = await Listing.find(query);
    
    res.render("listings/index.ejs", { 
      allListings,
      currentSearch: search || '',
      currentCategory: category || ''
    });
  } catch (error) {
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing doesn't exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      req.flash("error", "Image file is required!");
      return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Geocode the address
    
    if (newListing.location && newListing.country) {
      try {
        const geocodeResult = await geocodeAddress(
          newListing.location,
          newListing.country
        );

        if (geocodeResult) {
          newListing.coordinates = {
            lat: geocodeResult.lat,
            lng: geocodeResult.lng,
          };
        } else {
          // Log but don't fail the listing creation
          console.log(
            `Could not geocode address: ${newListing.location}, ${newListing.country}`
          );
        }
      } catch (geocodeError) {
        console.error("Geocoding error:", geocodeError);
        // Continue without coordinates
      }
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (error) {
    // Handle multer errors (file size, type, etc.)
    if (error.code === "LIMIT_FILE_SIZE") {
      req.flash("error", "File size too large! Maximum size is 5MB.");
      return res.redirect("/listings/new");
    }
    if (error.message === "Only image files are allowed!") {
      req.flash("error", "Only image files are allowed!");
      return res.redirect("/listings/new");
    }
    next(error);
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    // First, get the current listing to access old image info
    const listing = await Listing.findById(id);

    // Check if location or country has changed
    const locationChanged =
      listing.location !== req.body.listing.location ||
      listing.country !== req.body.listing.country;

    // Update listing fields (except image for now)
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // If location changed, re-geocode
    if (
      locationChanged &&
      req.body.listing.location &&
      req.body.listing.country
    ) {
      const geocodeResult = await geocodeAddress(
        req.body.listing.location,
        req.body.listing.country
      );

      if (geocodeResult) {
        listing.coordinates = {
          lat: geocodeResult.lat,
          lng: geocodeResult.lng,
        };
        await listing.save();
      }
    }

    // If new file uploaded, handle image replacement
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (listing.image && listing.image.filename) {
        try {
          await cloudinary.uploader.destroy(listing.image.filename);
        } catch (error) {
          req.flash("error", "File deleting error.");
        }
      }

      // Update with new image
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
      await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    // Handle multer errors
    if (error.code === "LIMIT_FILE_SIZE") {
      req.flash("error", "File size too large! Maximum size is 5MB.");
      return res.redirect(`/listings/${id}/edit`);
    }
    if (error.message === "Only image files are allowed!") {
      req.flash("error", "Only image files are allowed!");
      return res.redirect(`/listings/${id}/edit`);
    }
    next(error);
  }
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  // Find the listing first to get image info
  const listing = await Listing.findById(id);

  // Delete image from Cloudinary if it exists
  if (listing.image && listing.image.filename) {
    try {
      await cloudinary.uploader.destroy(listing.image.filename);
    } catch (error) {
      // Continue with listing deletion even if image deletion fails
    }
  }

  // Delete the listing from database
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing and image deleted!");
  res.redirect("/listings");
};
