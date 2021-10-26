const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "./uploads/category");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, file.originalname);
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

router.post("/addCategory", upload.single("image"), async (req, res) => {
  const { category } = req.body;
  const path = req.file.path;

  const categoryData = new Category({
    category_name: category,
    category_image: path,
  });

  await categoryData
    .save()
    .then((response) => {
      console.log(response);
      return res.json({ msg: "Category added successfully" });
    })
    .catch((err) => {
      console.log(err);
      if (Object.keys(err.keyPattern)[0] === "category_image")
        return res.status(403).json({ error: "Same image already exists" });
      else if (Object.keys(err.keyPattern)[0] === "category_name")
        return res.status(403).json({ error: "Same category already exists" });
      else {
        console.log(err);
        return res.status(404).json({ error: err });
      }
    });
});

module.exports = router;
