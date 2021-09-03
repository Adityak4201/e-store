const express = require("express");
const USER = require("../models/userModel");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
var google = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
router.get("/", async (req, res) => {
  res.send({ msg: "Welcome user" });

});

router.get("/getUser/:id", async (req, res) => {
  try {
    USER.findOne({ _id: req.params.id }, function (err, response) {
      if (err) console.log(err);
      res.send(response);
    }).select('-_id -password');;
  } catch (error) {
    res.status(403).send(error);
    console.log(error);
  }
});


router.route("/login").post([check('username', 'User Name is required').notEmpty(),
check(
    'password',
    'password is required'
).exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const username = req.body.username;
        const password = req.body.password;
        const userfind = await USER.findOne({ username: username });
        if (userfind) {
            let ismatch = await bcrypt.compare(password, userfind.password);
            if (ismatch) {
                let token = await userfind.generateAuthToken();
                console.log(token);
                res.send({ token })
            }
            else {
                res.json({ msg: "password incorrect" })
            }
        }
        else{
            res.send("no user found")
        }
    } catch (error) {
        console.log(error);
        res.status(401).send(error);
    }

})

router
  .route("/register")
  .post(
    [
      check("username", "Name is required").notEmpty(),
      check("country", "Country is required").notEmpty(),
      check("state", "State is required").notEmpty(),
      check("city", "City is required").notEmpty(),
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
        if (password === cpassword) {
          const userdata = new USER({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
          });
          let token = await userdata.generateAuthToken();
          await userdata
            .save()
            .then(() => {
              res
                .status(200)
                .send({ msg: "user succesfully registered", token });
            })
            .catch((err) => {
              res.status(403).json({ msg: err });
            });
        } else {
          res.send("password doesn't match!!");
        }
      } catch (error) {
        console.log(error);
        res.status(401).send(error);
      }
    }
  );


module.exports = router;
