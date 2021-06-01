/** @format */
require("dotenv").config(); // Load environment variables from an .env file into process.env

const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_LINK,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Mongodb connected !");
    else console.log("Connection error: " + err);
  }
); 
