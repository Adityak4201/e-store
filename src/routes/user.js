const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// var google = require("googleapis");
// const { OAuth2Client } = require("google-auth-library");
const authBeforeVerify = require("../middleware/authBeforeVerify");
const UserController = require("../controllers/user");
const {
  RegisterValidator,
  LoginValidator,
} = require("../middleware/validators");

router.get("/", auth, UserController.getUser);
router.get("/getUser/:id", UserController.getUserById);
router.post("/getUser/", auth, UserController.getLoggedInUser);
router.post("/login", LoginValidator, UserController.Login);
router.post("/register", RegisterValidator, UserController.Register);
router.get("/getAccType/:username", UserController.getUserRole);
router.get(
  "/getVerifyMail",
  authBeforeVerify,
  UserController.getVerificationMail
);
router.get("/verify", UserController.verifyUser);
router.post("/changePassMail", UserController.passwordChangeMail);
router.get("/changePass", UserController.changePassword);
router.post("/newPass", UserController.newPassword);

module.exports = router;
