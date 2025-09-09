const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next) => {
  console.log("inside jwtmiddleware");

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).json("Authorization Failed: Token is missing");
  }

  const token = authHeader.split(" ")[1];
  // console.log("Token:", token);

  if (token) {
    try {
      const jwtResponse = jwt.verify(token, process.env.JWTPASSWORD);
      // console.log("JWT Decoded:", jwtResponse);
      req.userId = jwtResponse.userId;
      console.log(req.userId);
      
      req.userType = jwtResponse.userType
      next(); // ✅ Only call next if token is valid
    } catch (err) {
      console.error("JWT Error:", err);
      return res.status(401).json("Authorization failed... please login");
    }
  } else {
    return res.status(404).json("Authorization Failed: Token is empty");
  }
};


module.exports = jwtMiddleware