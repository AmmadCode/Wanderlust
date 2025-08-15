require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

/// MongoDB Connection
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const database = process.env.MONGODB_DATABASE;
const connectionString = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority&appName=Cluster0`;

// IMPORTANT: Use exact category values from schema
const VALID_CATEGORIES = [
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
  "deserts"
];

// Category assignment logic based on keywords
const assignCategory = (listing) => {
  const title = (listing.title || '').toLowerCase();
  const description = (listing.description || '').toLowerCase();
  const location = (listing.location || '').toLowerCase();
  const country = (listing.country || '').toLowerCase();
  const combined = `${title} ${description} ${location} ${country}`;

  // Priority order matters - check specific keywords first
  if (combined.includes('pool') || combined.includes('swimming')) return 'pools';
  if (combined.includes('mountain') || combined.includes('hill') || combined.includes('alps')) return 'mountains';
  if (combined.includes('castle') || combined.includes('palace') || combined.includes('fort')) return 'castle';
  if (combined.includes('camp') || combined.includes('tent') || combined.includes('outdoor')) return 'camping';
  if (combined.includes('farm') || combined.includes('ranch') || combined.includes('countryside')) return 'farmhouse';
  if (combined.includes('arctic') || combined.includes('snow') || combined.includes('ice') || combined.includes('igloo')) return 'arctic';
  if (combined.includes('boat') || combined.includes('yacht') || combined.includes('ship') || combined.includes('sail')) return 'boats';
  if (combined.includes('desert') || combined.includes('sahara') || combined.includes('dune')) return 'deserts';
  if (combined.includes('city') || combined.includes('urban') || combined.includes('downtown') || combined.includes('metro')) return 'iconic-cities';
  
  // Location-based categorization
  if (location.includes('beach') || location.includes('coast')) return 'trending';
  if (country.includes('switzerland') || country.includes('nepal')) return 'mountains';
  
  // Default categories
  if (combined.includes('room') || combined.includes('apartment') || combined.includes('house')) return 'rooms';
  
  // If no specific match, mark as trending
  return 'trending';
};

async function addCategories() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB Atlas!");

    // First, let's check the current state
    const totalListings = await Listing.countDocuments({});
    const listingsWithCategory = await Listing.countDocuments({ category: { $exists: true, $ne: null } });
    console.log(`Total listings: ${totalListings}`);
    console.log(`Listings with category: ${listingsWithCategory}`);
    console.log(`Listings needing category: ${totalListings - listingsWithCategory}`);

    // Find listings without category
    const listings = await Listing.find({ 
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: "" }
      ]
    });
    
    console.log(`Found ${listings.length} listings to update`);

    let updateCount = 0;
    let errors = [];

    for (const listing of listings) {
      try {
        const newCategory = assignCategory(listing);
        
        // Validate category
        if (!VALID_CATEGORIES.includes(newCategory)) {
          console.error(`Invalid category "${newCategory}" for listing "${listing.title}"`);
          continue;
        }

        // Update using updateOne to avoid validation issues
        const result = await Listing.updateOne(
          { _id: listing._id },
          { $set: { category: newCategory } },
          { runValidators: true }
        );

        if (result.modifiedCount > 0) {
          updateCount++;
          console.log(`✓ Updated listing "${listing.title}" (ID: ${listing._id}) with category: ${newCategory}`);
        } else {
          console.log(`⚠ No changes made to listing "${listing.title}" (ID: ${listing._id})`);
        }
      } catch (error) {
        errors.push({ listing: listing.title, error: error.message });
        console.error(`✗ Error updating listing "${listing.title}":`, error.message);
      }
    }

    console.log("\n=== Migration Summary ===");
    console.log(`Total listings processed: ${listings.length}`);
    console.log(`Successfully updated: ${updateCount}`);
    console.log(`Errors encountered: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log("\nErrors:");
      errors.forEach(e => console.log(`- ${e.listing}: ${e.error}`));
    }

    // Verify the update
    const finalCount = await Listing.countDocuments({ category: { $exists: true, $ne: null } });
    console.log(`\nFinal listings with category: ${finalCount}`);

  } catch (error) {
    console.error("Fatal error during migration:", error);
    console.error("Stack trace:", error.stack);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Run the migration
addCategories();