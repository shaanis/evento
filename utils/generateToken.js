// utils/generateToken.js
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const secret = process.env.JWTPASSWORD;
  if (!secret) {
    throw new Error("JWTPASSWORD is not defined in environment variables");
  }

  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
