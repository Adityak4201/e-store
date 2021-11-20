const { check } = require("express-validator");

exports.LoginValidator = [
  check("userEmailPhone", "Email is required").notEmpty(),
  check("password", "password is required").exists(),
];

exports.RegisterValidator = [
  check("username", "Username is required").notEmpty(),
  check("phone", "phone is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
];
