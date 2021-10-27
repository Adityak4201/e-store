const express = require("express");
const auth = require("../middleware/auth");
const USER = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
var google = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const sendmail = require("../middleware/sendmail");
const { text } = require("body-parser");
const CryptoJS = require("crypto-js");
const { getCleanUser } = require("../utils/utils");
const authBeforeVerify = require("../middleware/authBeforeVerify");
const router = express.Router();
router.get("/", auth, async (req, res) => {
  res.send({ msg: "Welcome user" + req.user.username });
});

router.get("/getUser/:id", async (req, res) => {
  try {
    USER.findOne({ _id: req.params.id }, function (err, response) {
      if (err) console.log(err);
      res.send(response);
    }).select("-_id -password");
  } catch (error) {
    res.status(403).send(error);
    console.log(error);
  }
});

router.post("/getUser/", auth, async (req, res) => {
  try {
    USER.findOne({ _id: req.user.id }, function (err, response) {
      if (err) console.log(err);
      res.send(response);
    }).select("-_id -password");
  } catch (error) {
    res.status(403).send(error);
    console.log(error);
  }
});

router
  .route("/login")
  .post(
    [
      check("username", "User Name is required").notEmpty(),
      check("password", "password is required").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { userEmailPhone, password } = req.body;
        var givenroll = "basic";
        if (req.body.roll != undefined) {
          givenroll = req.body.roll;
        }
        const user = await USER.findOne({
          $or: [
            {
              email: userEmailPhone,
            },
            {
              phone: userEmailPhone,
            },
            {
              username: userEmailPhone,
            },
          ],
        });
        // console.log("Hello");
        if (!user) throw "User not found";
        let ismatch = await bcrypt.compare(password, user.password);
        if (ismatch) {
          let token = await user.generateAuthToken(givenroll);
          console.log(token);
          const cleanUser = getCleanUser(user);
          res.send({ user: cleanUser, token });
        } else {
          throw "Password is incorrect";
        }
      } catch (error) {
        // console.log(error);
        return res.status(401).json({ error });
      }
    }
  );

router
  .route("/register")
  .post(
    [
      check("username", "Userame is required").notEmpty(),
      check("email", "Please include a valid email").isEmail(),
      check(
        "password",
        "Please enter a password with 6 or more characters"
      ).isLength({ min: 6 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        // return res.status(200).send({ msg: "user succesfully login", token })

        const password = req.body.password;
        const cpassword = req.body.confpassword;
        var givenroll = "basic";
        if (req.body.roll != undefined) {
          givenroll = req.body.roll;
        }
        if (password === cpassword) {
          const allUsername = await USER.find({ profile_username : req.body.username }, "username").select("-_id").exec();

          console.log("allusernames " , allUsername);

          var username = "";
          loop = true;
          while (loop) {
            username = req.body.username + Math.floor(100000 + Math.random() * 900000);

            if(!(allUsername.some(i => i.username.includes(username)))){
              loop = false;
            }
          }

          // res
          // .status(200)
          // .send({ msg: allUsername , finalusername : username});

          const userdata = new USER({
            roll: givenroll,
            username: username,
            profile_username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
          });
          let token = await userdata.generateAuthToken(givenroll);
          await userdata
            .save()
            .then(async () => {
              subject = "Verify Your Account";
              hashPass = await CryptoJS.AES.encrypt(
                req.body.password,
                "verfiy email"
              ).toString();

              // console.log("before----------", hashPass);

              hashPass = await encodeURIComponent(hashPass);

              // console.log("----------", hashPass);
              mytext = `Click here to verify <a href='https://e-store-backend.herokuapp.com/user/verify?un=${username}&hp=${hashPass}'>Verfiy Now</a>`;
              to = req.body.email;
              var mailResponse = await sendmail(subject, mytext, to);
              res
                .status(200)
                .send({ msg: "user succesfully saved", token: token , userdetails : userdata });
            })
            .catch((err) => {
              // console.log(Object.keys(err.keyPattern));
              return res.status(403).json({
                error: `${Object.keys(err.keyPattern)[0]} already exists`,
              });
            });
        } else {
          return res.status(405).json({ error: "password doesn't match!!" });
        }
      } catch (error) {
        // console.log("error", error);
        res.status(401).send({ error: error });
      }
    }
  );

router.route("/getAccType/:username").get(async (req, res) => {
  USER.findOne({ username: req.params.username }, "roll", (err, result) => {
    if (err) return res.status(403).send(err);
    return res.json(result);
  }).select("-_id");
});

router.route("/getVerifyMail").post(authBeforeVerify, async (req, res) => {
  try {
    subject = "Verify Your Account";
    hashPass = await CryptoJS.AES.encrypt(
      req.body.password,
      "verfiy email"
    ).toString();
    // console.log("before----------", hashPass);
    hashPass = await encodeURIComponent(hashPass);
    // console.log("----------", hashPass);
    mytext = `Click here to verify <a href='https://e-store-backend.herokuapp.com/user/verify?un=${req.user.username}&hp=${hashPass}'>Verfiy Now</a>`;
    to = req.user.email;
    var mailResponse = await sendmail(subject, mytext, to);
    // console.log(mailResponse);
    res.status(200).json({ msg: "user succesfully saved", mail: mailResponse });
  } catch (error) {
    return res.status(404).json({ error });
  }
});

router.route("/verify").get(async (req, res) => {
  username = req.query.un;
  CryptoJSpassword = CryptoJS.AES.decrypt(req.query.hp, "verfiy email");
  password = CryptoJSpassword.toString(CryptoJS.enc.Utf8);
  console.log("password", password, req.query.hp);

  USER.findOne({ username: username }, async (err, result) => {
    if (err) return res.status(403).send(err);
    // console.log(result);
    let ismatch = await bcrypt.compare(password, result["password"]);

    if (ismatch) {
      USER.findOneAndUpdate(
        { username: username },
        { status: "approved" },
        { new: true },
        async (uerr, updatedresult) => {
          if (uerr) return res.status(403).send(uerr);
          return res.json(updatedresult);
        }
      );
    } else {
      return res.json({ msg: "Verfication Failed. Please SignUp Again" });
    }
  }).select("-_id");
  // res.status(200).send({ username: username, password: password });
});

module.exports = router;
