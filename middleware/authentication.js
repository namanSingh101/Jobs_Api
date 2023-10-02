const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
require("dotenv").config();
const User = require("../models/User")

const authenticationMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthenticatedError("Invalid authorization token provided");
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    throw new UnauthenticatedError("No authorization token provided");
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { id, name } = payload;
    const user = await User.findById(id).select("-password")
    req.user = user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Something went wrong")
  }
  
};

module.exports = authenticationMiddleware;
