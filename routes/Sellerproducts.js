const express = require("express");
const app = express();
const router = express.Router();
const Product = require("../models/productModel");
const Profile = require("../models/sellerModel");
const USERProfile = require("../models/profileModel");
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const multiparty = require("connect-multiparty");
app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "./noncompress");
    cb(null, "./uploads/products");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + path.extname(file.originalname));
  },
});

// path.extname(file.originalname)
const upload = multer({
  storage: storage,
});

router.route("/").get(auth, (req, res) => {
  if (req.user.roll != "admin") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a seller account" });
  }
  res.send(req.user.username);
});

router
  .route("/add/coverImage/:id")
  .patch(auth, upload.single("coverImage"), async (req, res) => {
    console.log("upload image");
    // await compress(req.file.filename);

    Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          coverImage: req.file.filename,
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

router.route("/Add").post(auth, (req, res) => {
  if (req.user.roll != "admin") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a seller account" });
  }
  // console.log(req.user);
  // console.log(req.body);
  const { username } = req.user;
  const {
    productname,
    productmetadescription,
    productdescription,
    price,
    sellprice,
    variation,
    inventory,
    Item_Returnable,
    category,
  } = req.body;
  const Item = Product({
    productname,
    username,
    productmetadescription,
    productdescription,
    price,
    sellprice,
    variation,
    inventory,
    Item_Returnable,
    category,
  });
  Item.save()
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    });
});

router.route("/getOwnProducts").get(auth, (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "create a seller account to view" });
  }
  Product.find({ username: req.user.username }, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

router.route("/getByLimit").get(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startindex = (page - 1) * limit;
  const posts = await Product.find({ username: req.user.username })
    .limit(limit)
    .skip(startindex)
    .exec();
  res.send(posts);
});

router.route("/deleteSellerProduct/:id").delete(auth, (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "create a seller account to view" });
  }

  Product.findOneAndDelete(
    {
      $and: [{ username: req.user.username }, { _id: req.params.id }],
    },
    (err, result) => {
      if (err) return res.json(err);
      else if (result) {
        console.log(result);
        return res.json("Product deleted");
      }
      return res.json("Product not deleted");
    }
  );
});

router.route("/editProductDetails").post(auth, (req, res) => {
  if (req.user.roll != "admin") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a seller account" });
  }

  Product.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        username: req.user.username,
        user_id: req.user._id,
        ...req.body,
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

router.route("/active/").post(auth, (req, res) => {
  Product.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        active: req.body.active,
      },
    },
    (err, result) => {
      if (err) return res.json(err);
      return res.json({ data: result });
    }
  );
});

module.exports = router;
