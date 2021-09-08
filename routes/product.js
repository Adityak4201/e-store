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
  const Item = Product({
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
  });
  Item.save()
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    });
});

router.route("/products").get(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startindex = (page - 1) * limit;
  const posts = await Product.find({}).limit(limit).skip(startindex).exec();
  res.send(posts);
});

router.route("/getProductsByLimit").get(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startindex = (page - 1) * limit;
  const posts = await Product.find({ })
    .limit(limit)
    .skip(startindex)
    .exec();
  res.send(posts);
});

router.route("/IdProduct/:id").get((req, res) => {
  Product.findOne({ _id: req.params.id }, (err, result) => {
    if (err) return res.status(403).send(err);
    return res.send(result);
  });
});

router.route("/SellerProduct/:username").get((req, res) => {
  Product.find({ username: req.params.username }, (err, result) => {
    if (err) return res.status(403).send(err);
    return res.json(result);
  });
});

router.route("/getOtherProduct").get(auth, (req, res) => {
  Product.find(
    { username: { $ne: req.user.username } },
    (err, result) => {
      if (err) return res.json(err);
      return res.json({ data: result });
    }
  );
});

router.route("/AddToCart").get(auth, async (req, res) => {
  try {
    let AddToCartid = [];
    await Profile.find({ username: req.user.username }, async (err, result) => {
      try {
        if (err) {
          AddToCartid = [];
        }
        if (result != null) {
          AddToCartid = result[0]._id;
        }
        const AddToCartpost = await USERProfile.find({
          _id: req.user._id },
          {
            $in: {
              cart: AddToCartid,
            },
          },
        );
        res.send(AddToCartpost);
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
