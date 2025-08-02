require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const { listingSchema } = require("./schema.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// MongoDB Connection
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const database = process.env.MONGODB_DATABASE;
const connectionString = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(connectionString)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

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






// Root Route
app.get("/", (req, res) => {
  res.send("Hello I am root!")
});

// Listings Routes

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings })
}));

// New Route (GET for form)
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
})

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

// Create Route (POST)
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

  // Create a new listing instance and save it to the database
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  console.log("New Listing Created");
  res.redirect("/listings");

}));

// Edit Route (GET for form)
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// Update Route (PUT)
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  // Find the listing by ID and update it with the new data
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  console.log("Listing Updated");
  res.redirect(`/listings/${id}`);
}));

// Delete Route (DELETE)

app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Listing Deleted");
  res.redirect("/listings");
}));













app.use((req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
})




// Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).send(message);

  res.status(statusCode).render("listings/error.ejs", { message });

})




app.listen(8080, () => {
  console.log('Server is listing on port 8080');
})
