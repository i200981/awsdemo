const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const tokenValidator = asyncHandler(async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    res.status(400);
    throw new Error("Token not provided");
  }
  jwt.verify(token, "wajidali", (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("Unauthorized access");
    }
    req.user = decoded.user;
    console.log(decoded);
    next();
  });
});

module.exports = tokenValidator;
