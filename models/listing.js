const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// Define category enum
const categoryEnum = [
  "trending",
  "rooms",
  "iconic-cities",
  "mountains",
  "castle",
  "pools",
  "camping",
  "farmhouse",
  "arctic",
  "boats",
  "deserts",
];

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: categoryEnum,
    default: "rooms",
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
    console.log("Reviews deleted for listing:", listing._id);
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
