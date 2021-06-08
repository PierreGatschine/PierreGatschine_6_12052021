/** @format */
const express = require("express");
//const bodyParser = require("body-parser"); // Analyze the body of incoming requests
require("./models/dbConfig"); // 
const mongoose = require("mongoose"); // Object modeling tool
const helmet = require("helmet"); // secure HTTP header
const path = require("path"); // exact copy of the "path" module of NodeJS

// Routes
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

// DB
mongoose.set("useFindAndModify", false);

// Application
const app = express();

// Middleware
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

app.use(express.json());


app.use("/images", express.static(path.join(__dirname, "images"))); 
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes); 


module.exports = app;
