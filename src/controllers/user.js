const USER = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const CryptoJS = require("crypto-js");
const sendmail = require("../middleware/sendmail");
const { getCleanUser } = require("../utils/utils");

exports.getUser = async (req, res) => {
  res.send({ msg: "Welcome user" + req.user.username });
};

exports.getUserById = async (req, res) => {
  try {
    USER.findOne({ _id: req.params.id }, function (err, response) {
      if (err) console.log(err);
      res.send(response);
    }).select("-_id -password");
  } catch (error) {
    res.status(403).send(error);
    console.log(error);
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    USER.findOne({ _id: req.user.id }, function (err, response) {
      if (err) console.log(err);
      res.send(response);
    }).select("-_id -password");
  } catch (error) {
    res.status(403).send(error);
    console.log(error);
  }
};

exports.Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userEmailPhone, password } = req.body;
    var givenrole = "basic";
    if (req.body.role != undefined) {
      givenrole = req.body.role;
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
      let token = await user.generateAuthToken(givenrole);
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
};

exports.Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // return res.status(200).send({ msg: "user succesfully login", token })

    const password = req.body.password;
    const cpassword = req.body.confpassword;
    var givenrole = "basic";
    if (req.body.role != undefined) {
      givenrole = req.body.role;
    }
    if (password === cpassword) {
      const allUsername = await USER.find(
        { profile_username: req.body.username },
        "username"
      )
        .select("-_id")
        .exec();

      console.log("allusernames ", allUsername);

      var username = "";
      loop = true;
      while (loop) {
        username =
          req.body.username + Math.floor(100000 + Math.random() * 900000);

        if (!allUsername.some((i) => i.username.includes(username))) {
          loop = false;
        }
      }

      // res
      // .status(200)
      // .send({ msg: allUsername , finalusername : username});

      const userdata = new USER({
        role: givenrole,
        username,
        profile_username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      });
      let token = await userdata.generateAuthToken(givenrole);
      await userdata
        .save()
        .then(async () => {
          // console.log(userdata.password);
          subject = "Verify Your Account";
          hashPass = await CryptoJS.AES.encrypt(
            userdata.password,
            "verfiy email"
          ).toString();

          // console.log("before----------", hashPass);

          hashPass = await encodeURIComponent(hashPass);

          // console.log("----------", hashPass);
          mytext = `Click here to verify <a href='https://e-store-backend.herokuapp.com/user/verify?un=${username}&hp=${hashPass}'>Verfiy Now</a>`;
          to = req.body.email;
          var mailResponse = await sendmail(subject, mytext, to);
          const user = await getCleanUser(userdata);
          res.status(200).send({
            msg: "user succesfully saved",
            token: token,
            userdetails: user,
          });
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
};

exports.getUserRole = async (req, res) => {
  USER.findOne({ username: req.params.username }, "role", (err, result) => {
    if (err) return res.status(403).send(err);
    return res.json(result);
  }).select("-_id");
};

exports.getVerificationMail = async (req, res) => {
  try {
    subject = "Verify Your Account";
    hashPass = await CryptoJS.AES.encrypt(
      req.user.password,
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
};

exports.verifyUser = async (req, res) => {
  username = req.query.un;
  CryptoJSpassword = CryptoJS.AES.decrypt(req.query.hp, "verfiy email");
  password = CryptoJSpassword.toString(CryptoJS.enc.Utf8);
  // console.log("password", password, req.query.hp);

  USER.findOne({ username: username }, async (err, result) => {
    if (err) return res.status(403).send(err);

    if (password === result.password) {
      USER.findOneAndUpdate(
        { username: username },
        { status: "approved" },
        { new: true },
        async (uerr, updatedresult) => {
          if (uerr) return res.status(403).json({ err: uerr });
          return res.json({ msg: "Verification Successfull!! " });
        }
      );
    } else {
      console.log(password, result.password);
      return res.json({ msg: "Verfication Failed. Please SignUp Again" });
    }
  }).select("-_id");
  // res.status(200).send({ username: username, password: password });
};

exports.passwordChangeMail = async (req, res) => {
  try {
    subject = "Verify Your Account";
    hashPass = await CryptoJS.AES.encrypt(
      req.body.email,
      "verfiy email"
    ).toString();
    // console.log("before----------", hashPass);
    hashPass = await encodeURIComponent(hashPass);
    // console.log("----------", hashPass);
    mytext = `Click here to verify <a href='https://e-store-backend.herokuapp.com/user/changePass?un=${req.body.username}&hp=${hashPass}'>Verfiy Now</a>`;
    to = req.body.email;
    var mailResponse = await sendmail(subject, mytext, to);
    // console.log(mailResponse);
    res.status(200).json({ msg: "mail sent ", mail: mailResponse });
  } catch (error) {
    return res.status(404).json({ error });
  }
};

exports.changePassword = async (req, res) => {
  username = req.query.un;
  CryptoJSemail = CryptoJS.AES.decrypt(req.query.hp, "verfiy email");
  email = CryptoJSemail.toString(CryptoJS.enc.Utf8);

  USER.findOne(
    { profile_username: username, email: email },
    async (err, result) => {
      if (err) return res.status(403).send(err);
      // console.log(result);
      return res.json({ msg: result });
    }
  ).select("-_id");
  // res.status(200).send({ username: username, password: password });
};

exports.newPassword = async (req, res) => {
  newpass = await bcrypt.hash(req.body.newpass, 10);

  await USER.findOneAndUpdate(
    { profile_username: req.body.username, email: req.body.email },
    { password: newpass },
    async (err, result) => {
      if (err) return res.status(403).send(err);
      // console.log(result);
      return res.json({ msg: "password updated", result: result });
    }
  ).select("-_id");
  // res.status(200).send({ username: username, password: password });
};
