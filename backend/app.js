/** @format */
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
require("./models/dbConfig");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");
const app = express();
app.use(helmet());

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

mongoose.set("useFindAndModify", false);

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

app.use(bodyParser.json());

app.use((req, res) => {
  console.log(req.body);
  res.json({ message: "Une nouvelle requête !" });
});

app.use("/images", express.static(path.join(__dirname, "images"))); 
app.use("/api/sauces", saucesRoutes); 
app.use("/api/auth", userRoutes);

module.exports = app;
