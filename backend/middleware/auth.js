/** @format */
require("dotenv").config(); // Load environment variables from an .env file into process.env

const jwt = require("jsonwebtoken");// An implementation of JSON Web Tokens

const tokenRandom = process.env.TOKEN_RANDOM;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, tokenRandom);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
