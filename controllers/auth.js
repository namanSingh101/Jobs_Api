const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");

// var jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
//require("dotenv").config();

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new NotFoundError("User credentials not found");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User Not Found");
  }
  let result = await  user.comparePassword(password)
  if (!result) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  return res
    .status(200)
    .json({
      msg: "Login successfull",
      user: { name: user.name },
      token: user.createJwt(),
    });
};

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new NotFoundError("Name or email or password not found");
  }
  let user = await User.create({
    name: name,
    email: email,
    password: password,
  });
  if (!user) {
    throw new NotFoundError("Something went wrong");
  }

  const token = user.createJwt();

  return res.status(StatusCodes.CREATED).json({ user: user.name, token });
};

module.exports = {
  login,
  register,
};
