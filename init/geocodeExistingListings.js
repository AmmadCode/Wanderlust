require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { geocodeAddress } = require("../utils/geocoding");

/// MongoDB Connection
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const database = process.env.MONGODB_DATABASE;
const connectionString = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority&appName=Cluster0`;

async function geocodeExistingListing() {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB");

    // find all listings without coordinates
    const listings = await Listing.find({
      $or: [
        { coordinates: { $exists: false } },
        { "coordinates.lat": null },
        { "coordinates.lng": null },
      ],
    });

    console.log(`Found ${listings.length} listings without coordinates`);
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];

      if (listing.location && listing.country) {
        console.log(
          `Geocoding ${i + 1}/${listings.length}: ${listing.location}, ${listing.country}`
        );

        const geocodeResult = await geocodeAddress(
          listing.location,
          listing.country
        );

        if (geocodeResult) {
          listing.coordinates = {
            lat: geocodeResult.lat,
            lng: geocodeResult.lng,
          };
          await listing.save();
          console.log(`✓ Saved coordinates for: ${listing.title}`);
        } else {
          console.log(`✗ Could not geocode: ${listing.title}`);
        }

        // Add delay to respect Nominatim rate limits (1 request per second)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log("Geocoding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

geocodeExistingListing();
