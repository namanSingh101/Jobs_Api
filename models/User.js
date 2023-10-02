const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: 3,
    maxLength: 20,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    minLength: 10,
    maxLength: 50,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please fill a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Please Enter Password"],
    unique: true,
  },
},{ timestamps: true });

UserSchema.pre("save", async function () {
  const saltRounds = 10;
  let genSalt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, genSalt);
});

UserSchema.methods.createJwt = function () {
  //generating token
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
