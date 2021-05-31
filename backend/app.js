/** @format */
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
require("./models/dbConfig");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

mongoose.set("useFindAndModify", false);

const app = express();
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(cors());
app.use(bodyParser.json());


/* app.use((req, res) => {
  console.log(req.body);
  res.json({ message: "Une nouvelle requête !" });
});   */

app.use("/images", express.static(path.join(__dirname, "images"))); 
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes); 


module.exports = app;
