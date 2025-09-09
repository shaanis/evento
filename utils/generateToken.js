// utils/generateToken.js
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWTPASSWORD, {
    expiresIn: "7d", // valid for 7 days
  });
};

module.exports = generateToken;
