const express = require("express");
const router = express.Router();
const Profile = require("../models/profileModel");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

router.get("/", auth, async (req, res) => {
  res.send({ msg: "Get Your profile", roll: req.user.roll });
});

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "./uploads/profile");
  },
  filename: (req, file, cb) =>
    cb(null, req.user._id + path.extname(file.originalname)),
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

    if(req.user.roll != "basic"){
        return res.status(404).send({msg : "You can't add profile create a basic account"});
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

    if(req.user.roll != "basic"){
        return res.status(404).send({msg : "You can't add profile create a basic account"});
    }

    
    var address = {
      "Type" : req.body.addressType,
      "Address " : req.body.address
    }

  const profiledata = Profile({
    username: req.body.username,
    address: address,
    about: req.user.about,
    dob: req.body.dob,
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
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


router.route("/editAddress").post(auth, (req, res) => {
  if (req.user.roll != "basic") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a basic account" });
  }

  Product.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        address : req.body.address
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        console.log(err);
      }
      return res.json(result);
    }
  );
});


module.exports = router;
