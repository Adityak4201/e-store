const jwt = require("jsonwebtoken");
const Register = require("../models/userModel");
const config = require("../config");

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    // console.log("x-auth-token", token);
    const verifyuser = jwt.verify(token, config.key);
    // console.log("verifyuser", verifyuser);
    console.log("role", verifyuser.role, "id", verifyuser._id);

    const user = await Register.findOne({
      _id: verifyuser._id,
      role: verifyuser.role,
    }).select("-password");

    req.token = token;
    req.user = user;
    if (user != null) {
      if (user.status !== "approved")
        return res
          .status(406)
          .json({ error: "Please verify yourself first!!!" });
      next();
    } else {
      return res.status(401).json({ error: "no such user" });
    }
  } catch (error) {
    res.status(401).send(error);
    console.log(error);
  }
};
module.exports = auth;
