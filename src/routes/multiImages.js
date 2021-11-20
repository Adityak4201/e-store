const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/multiImages");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const filefilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  filefilter,
});

router.post("/multiImages", upload.array("images", 5), async (req, res) => {
  const reqFiles = [];
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push("/multiImages/" + req.files[i].filename);
  }

  const images = new Category({
    images: reqFiles,
  });

  await images
    .save()
    .then((res) => {
      console.log(res);
      res.json({ msg: "Images Successfully Uploaded!!" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(403).json({ error: err });
    });
});

module.exports = router;
