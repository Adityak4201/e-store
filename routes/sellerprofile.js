const express = require("express");
const router = express.Router();
const Profile = require("../models/sellerModel");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

router.get("/", auth, async (req, res) => {
  res.send({ msg: "Get Your profile", roll: req.user.roll });
});

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "./uploads/sellerprofile");
  },
  filename: (req, file, cb) => {
    cb(null, req.user._id + path.extname(file.originalname));
  },
});

const filefilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,

  filefilter,
});

router
  .route("/add/image")
  .patch(auth, upload.single("profileimg"), (req, res) => {
    console.log("user is is ", req.user._id);
    if (req.user.roll != "admin") {
      return res
        .status(404)
        .send({ msg: "You can't add profile create a seller account" });
    }

    Profile.findOneAndUpdate(
      { username: req.user.username },
      {
        $set: {
          profileimg: req.file.filename,
        },
      },
      { new: true },
      (err, profile) => {
        if (err) return res.status(500).send(err);
        const response = {
          message: "image added successfully updated",
          data: profile,
        };
        return res.status(200).send(response);
      }
    );
  });

router.route("/add").post(auth, (req, res) => {
  if (req.user.roll != "admin") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a seller account" });
  }


  const profiledata = Profile({
    username: req.user.username,
    ...req.body
  });
  profiledata
    .save()
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err), res.json({ err });
    });
});


router.route("/getAllMessages/").get(auth, (req, res) => {

  if (req.user.roll != "admin") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a seller account" });
  }


  Profile.find({ username: req.user.username }, "message", (err, result) => {
    if (err) return res.status(403).send(err);
    return res.json(result);
  });
});

router.route("/getUserMessage/:username").get(auth, (req, res) => {

  if (req.user.roll != "admin") {
    return res
      .status(404)
      .send({ msg: "create a seller account" });
  }

  var paramsUsername = req.params.username;

  var messages = {};
  Profile.find({ username: req.user.username }, "message", (err, result) => {
    if (err) return res.status(403).send(err);

    var i = 0;
    for(x in result[0]["message"]){
      if(result[0]["message"][x]["by"] == paramsUsername || result[0]["message"][x]["to"] == paramsUsername){
        messages[i] = result[0]["message"][x]
        i++;
      }
    }
    return res.json(messages);
  });
});


module.exports = router;
