// Add this at the top of init/index.js
require('dotenv').config({ path: '../.env' }); 
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");




/// MongoDB Connection
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




const initDB = async () => {
    await Listing.deleteMany({});
    console.log("Data was deleted");
    initData.data = initData.data.map((obj) => ({...obj, owner: "6894c1ecbd8298d839d62ab6"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};


initDB();