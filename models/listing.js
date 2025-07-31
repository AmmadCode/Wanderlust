const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImage = {
  url: "https://images.unsplash.com/photo-1627283391728-701007067e7e?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  filename: "default"
};

const listingSchema = new Schema({ 
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    image: {
        url: {
            type: String,
            set: v => v === "" ? defaultImage.url : v
        },
        filename: {
            type: String,
            set: v => v === "" ? defaultImage.filename : v
        }
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;