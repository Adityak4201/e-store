const express = require("express");
const router = express.Router();
const Profile = require("../models/profileModel");
const ShopProduct = require("../models/shoppingModel");
const Product = require("../models/productModel");
const SellerProfile = require("../models/sellerModel");
const message_Seller = require("../models/messageModel");
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
    if (req.user.roll != "basic") {
      return res
        .status(404)
        .send({ msg: "You can't add profile create a basic account" });
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
  if (req.user.roll != "basic") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a basic account" });
  }

  var address = {
    Type: req.body.addressType,
    "Address ": req.body.address,
  };

  const profiledata = Profile({
    username: req.user.username,
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
        address: req.body.address,
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

// router.route("/getSellersCategory").get(async (req, res) => {
//   try {
//     await SellerProfile.find({}, "bussiness_category", function (err, result) {
//       if (err) return res.status(403).send(err);
//       return res.json(result);
//     }).distinct("bussiness_category");
//   } catch (error) {
//     console.log(err), res.json({ err: err });
//   }
// });

router.route("/filterBySellerCategory").post(auth, (req, res) => {
  const category = req.body.category;
  try {
    SellerProfile.find(
      { bussiness_category: category },
      function (err, result) {
        if (err) return res.status(403).json({ error: err });
        return res.json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(402).json({ error: err });
  }
});

router.route("/getProductsByCategory").get(async (req, res) => {
  const category = req.body.category;
  try {
    const products = await Product.find({ category: category });

    console.log(products);

    return res.json({ products: products });
  } catch (err) {
    console.log(err);
    return res.status(402).json({ error: err });
  }
});

router.post("/search", async (req, res) => {
  const { str } = req.body;
  try {
    const shops = await SellerProfile.find({
      $or: [
        {
          bussiness_name: { $regex: str },
        },
        {
          bussiness_category: { $regex: str },
        },
      ],
    });

    const products = await Product.find({
      $or: [
        {
          productname: { $regex: str },
        },
        {
          category: { $regex: str },
        },
      ],
    });

    if (!shops.length && !products.length) throw "No Matches Found";

    return res.json({ shops, products });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
});

router.route("/getShopsByCategory").get(async (req, res) => {
  const category = req.body.category;
  try {
    const shops = await SellerProfile.find({ category: category });

    console.log(shops);

    return res.json({ shops: shops });
  } catch (err) {
    console.log(err);
    return res.status(402).json({ error: err });
  }
});

router.route("/message").post(auth, (req, res) => {
  try {
    const sentMessage = message_Seller({
      by: req.user.username,
      to: req.body.message_to,
      message: req.body.message,
    });

    sentMessage
      .save()
      .then((result) => {
        res.json({ result });
      })
      .catch((err) => {
        console.log(err), res.json({ err });
      });
  } catch (err) {
    console.log(err), res.json({ err: err });
  }
});

// all chats of a user whoever he messaged or from whoever he recived message
router.route("/userMessage").post(auth, (req, res) => {
  try {
    message_Seller.find(
      { $or: [{ to: req.user.username }, { by: req.user.username }] },
      function (err, result) {
        if (err) return res.status(403).send(err);
        return res.json(result);
      }
    );
  } catch (err) {
    console.log(err), res.json({ err: err });
  }
});

// user message to any other particular user
router.route("/chatWithUser").post(auth, (req, res) => {
  try {
    message_Seller.find(
      {
        $or: [
          { to: req.body.username, by: req.user.username },
          { to: req.user.username, by: req.body.username },
        ],
      },
      function (err, result) {
        if (err) return res.status(403).send(err);
        return res.json(result);
      }
    );
  } catch (err) {
    console.log(err), res.json({ err: err });
  }
});

// all users who have messaged to logged in user
router.route("/messagedBy").post(auth, (req, res) => {
  try {
    message_Seller
      .find({ to: req.user.username }, "by")
      .distinct("by", async function (err, result) {
        if (err) return res.status(403).send(err);
        return res.json(result);
      });
  } catch (err) {
    console.log(err), res.json({ err: err });
  }
});

// all user who looged in user have messaged
router.route("/messagedTo").post(auth, (req, res) => {
  try {
    message_Seller
      .find({ by: req.user.username }, "to")
      .distinct("to", async function (err, result) {
        if (err) return res.status(403).send(err);
        return res.json(result);
      });
  } catch (err) {
    console.log(err), res.json({ err: err });
  }
});

router.post("/addShopReview", auth, async (req, res) => {
  if (req.user.roll != "basic") {
    return res.status(404).send({ msg: "Login as customer to give a review" });
  }
  try {
    const { _id } = req.user;
    const { shop_id, ratings, comments } = req.body;
    const query = { _id: shop_id };
    const update = {
      $addToSet: {
        reviews: {
          customer_id: _id,
          ratings,
          comments,
        },
      },
    };
    const options = { new: true };
    await SellerProfile.findOneAndUpdate(
      query,
      update,
      options,
      (err, shop) => {
        if (err) return res.status(500).send(err);
        const response = {
          message: "Shop Review Added",
          data: shop,
        };
        return res.status(200).send(response);
      }
    );
  } catch (error) {
    return res.status(402).json({ error });
  }
});

router.post("/getRatings", async (req, res) => {
  try {
    const { shop_id } = req.body;
    const shop = await SellerProfile.findOne({ _id: shop_id });
    const length = shop.reviews.length;
    if (length === 0) res.json({ msg: "No Reviews" });
    const avg_reviews =
      shop.reviews.reduce((prev, curr) => prev + curr.ratings, 0) / length;
    res.json({ avg_reviews, length });
  } catch (error) {
    return res.status(402).json({ error });
  }
});

router.post("/updateShopReview", auth, async (req, res) => {
  if (req.user.roll != "basic") {
    return res.status(404).send({ msg: "Login as customer to give a review" });
  }
  try {
    const { _id } = req.user;
    const { shop_id, ratings, comments } = req.body;
    await SellerProfile.findOneAndUpdate(
      { _id: shop_id, "reviews.customer_id": _id },
      {
        $set: { "reviews.$.ratings": ratings, "reviews.$.comments": comments },
      },
      { new: true },
      function (err, shop) {
        if (err) return res.status(500).send(err);
        const response = {
          message: "Shop Review Updated",
          data: shop,
        };
        return res.status(200).send(response);
      }
    );
  } catch (error) {
    return res.send(401).json({ error });
  }
});

router.post("/cancelOrder", auth, async (req, res) => {
  if (req.user.roll != "basic") {
    return res.status(404).send({ msg: "Login to cancel the order" });
  }

  const { order_id, status } = req.body;
  await ShopProduct.findOneAndUpdate(
    {
      _id: order_id,
      $and: [{ status: { $ne: "cancelled" } }, { status: { $ne: "rejected" } }],
    },
    { status },
    { new: true, runValidators: true }
  )
    .then((cancelledOrder) => {
      if (!cancelledOrder)
        return res
          .status(402)
          .json({ error: "Order has been already rejected/cancelled" });
      // var noti_to_seller = SellerNoti(
      //   req.user._id,
      //   "Product Status Has been updated to " + status
      // );
      // var noti_to_buyer = BuyerNoti(
      //   updatedOrder.buyerid,
      //   "Product has been " + status + " by the seller"
      // );
      return res.send({ cancelledOrder });
    })
    .catch((error) => {
      if (error.errors) return res.status(403).json({ error: error.errors });
      else res.status(404).json({ error: "No order found" });
    });
});

router.post("/filterShopsByLocation", async (req, res) => {
  try {
    const { country, state, city } = req.body;
    // console.log(country, state, city);
    let shopsByLocation = [];
    if (country === undefined && state === undefined && city === undefined)
      return res
        .status(403)
        .json({ error: "Select a location to show results" });
    if (state === undefined && city === undefined)
      shopsByLocation = await SellerProfile.find({ country });
    else if (city === undefined)
      shopsByLocation = await SellerProfile.find({
        $and: [{ country }, { state }],
      });
    else
      shopsByLocation = await SellerProfile.find({
        $and: [{ country }, { state }, { city }],
      });
    if (shopsByLocation.length === 0) throw "No Shops in this Location";
    return res.json({ shops: shopsByLocation });
  } catch (e) {
    return res.status(402).send({ error: e });
  }
});

module.exports = router;
