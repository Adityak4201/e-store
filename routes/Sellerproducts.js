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
        productname: req.body.productname,
        productmetadescription: req.body.productmetadescription,
        productdescription: req.body.productdescription,
        price: req.body.price,
        sellprice: req.body.sellprice,
        variation: req.body.variation,
        inventory: req.body.inventory,
        Item_Returnable: req.body.Item_Returnable,
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
