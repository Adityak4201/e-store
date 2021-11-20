const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const {
  getProductCategories,
  addProductCategory,
} = require("../controllers/category");

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

router.post("/category", upload.single("image"), addProductCategory);
router.get("/category", getProductCategories);

module.exports = router;
