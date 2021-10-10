const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const methods = require("methods");

const userschema = mongoose.Schema;

const user = userschema({
  roll: {
    type: String,
    default: "basic",
    enum: ["basic", "admin"],
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email!");
      }
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  confpassword: {
    type: String,
  },
  status: {
    type: String,
    default: "unapproved",
    enum: ["unapproved", "approved"],
  },
});

user.methods.generateAuthToken = async function (givenroll) {
  try {
    const token = jwt.sign(
      { _id: this._id.toString(), roll: givenroll },
      config.key
    );
    await this.save();
    console.log("user jwt token is : ", token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

user.methods.generateGoogleAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign({ _id: this._id.toString() }, config.key);
    // await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

user.pre("save", async function (next) {
  // console.log(`current password is ${this.password}`)
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
  this.confpassword = undefined;
  next();
});

user.methods.hashpass = async function () {
  // console.log(`current password is ${this.password}`)
  hash_password = await bcrypt.hash(this.password, 10);
  return hash_password;
};

module.exports = mongoose.model("user", user);
