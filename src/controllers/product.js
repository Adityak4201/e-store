const Product = require("../models/productModel");
const USERProfile = require("../models/profileModel");
const ShopProduct = require("../models/shoppingModel");
const SellerNoti = require("../middleware/seller_noti");
const BuyerNoti = require("../middleware/buyer_noti");
const Razorpay = require("razorpay");

//----------------------Pay For Product---------------------------
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_O7q0EhSlhM8o2B", // your `KEY_ID`
  key_secret: "U4iA3CaZoEwZEP8lXa4OVid6", // your `KEY_SECRET`
});

exports.getAllProducts = async (req, res) => {
  const posts = await Product.find({ active: true }).exec();
  res.send(posts);
};

exports.getProductsByLimit = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startindex = (page - 1) * limit;
  const posts = await Product.find({ active: true })
    .limit(limit)
    .skip(startindex)
    .exec();
  res.send(posts);
};

exports.getProductById = async (req, res) => {
  await Product.findOne({ _id: req.params.id, active: true }, (err, result) => {
    if (err) return res.status(403).send(err);
    return res.send(result);
  });
};

exports.getProductImg = async (req, res) => {
  await Product.findOne(
    { _id: req.params.id, active: true },
    "coverImage",
    (err, result) => {
      if (err) return res.status(403).send(err);
      return res.send(result);
    }
  );
};

exports.getSellersAllProducts = async (req, res) => {
  await Product.find(
    { username: req.params.username, active: true },
    (err, result) => {
      if (err) return res.status(403).send(err);
      return res.json(result);
    }
  );
};

exports.getSellerProdByLim = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startindex = (page - 1) * limit;

  try {
    var prods = await Product.find({
      username: req.params.username,
      active: true,
    })
      .limit(limit)
      .skip(startindex)
      .exec();

    res.json({ productsByLimit: prods });
  } catch (error) {
    res.json({ err: error });
  }
};

exports.getOtherSellerProd = async (req, res) => {
  await Product.find(
    { username: { $ne: req.user.username }, active: true },
    (err, result) => {
      if (err) return res.json(err);
      return res.json({ data: result });
    }
  );
};

exports.getOtherSellerProdByLim = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startindex = (page - 1) * limit;

  try {
    var prods = await Product.find({
      username: { $ne: req.user.username },
      active: true,
    })
      .limit(limit)
      .skip(startindex)
      .exec();
    res.json({ otherprodsByLimit: prods });
  } catch (error) {
    res.json({ err: error });
  }
};

exports.addProdToCart = async (req, res) => {
  if (req.user.role != "basic") {
    return res
      .status(404)
      .send({ msg: "Login as customer to add products to cart" });
  }

  try {
    const { product_id, count } = req.body;
    const product_details = await Product.findOne({
      _id: product_id,
      active: true,
    });
    // console.log(product_details);
    // return res.json({ product: product_details });
    const query = { username: req.user.username };
    const update = {
      $push: {
        cart: 
          req.body
        ,
      },
    };
    // const options = { upsert: true };
    const userProfile = await USERProfile.findOne(query);

    if (userProfile === null) {
      const user = await USERProfile({
        username: req.user.username,
        cart: [
          
            req.body,
          ,
        ],
      }).save();
      console.log(user);
      return res.json({
        msg: "Product Added to empty previously Empty Profile",
      });
    } else {
      if (
        userProfile.cart.length === 0 ||
        product_details.username === userProfile.cart[0].seller_username
      ) {
        await USERProfile.updateOne(query, update);
        return res.json({ msg: "Added to previously filled/empty Cart" });
      } else {
        const update = {
          $set: {
            cart: req.body,
          },
        };
        await USERProfile.updateOne(query, update);
        return res.json({ msg: "Removed previous items and updated to cart" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(402).send({ error });
  }
};

exports.removeProdFromCart = async (req, res) => {
  if (req.user.role != "basic") {
    return res
      .status(404)
      .send({ msg: "Login as customer to remove products from cart" });
  }
  try {
    const { product_id, count } = req.body;
    const query = {
      username: req.user.username,
      "cart.product_id": product_id,
    };
    const update = {
      $set: {
        cart: {
          product_id: product_id,
          product_count: count,
        },
      },
    };
    const user = await USERProfile.findOne(query);

    if (!user) throw "Given Product is missing in the cart";
    else if (
      user.cart.filter((c) => c.product_id === product_id)[0].product_count <=
      count
    )
      throw "Removal count is greater than current count";
    await USERProfile.findOneAndUpdate(query, update);
    return res.json({ msg: "Cart Updated" });
  } catch (error) {
    console.log(error);
    return res.status(402).send({ error });
  }
};

exports.createPaymentOrder = async (req, res) => {
  // STEP 1:
  params = req.body;
  await razorpayInstance.orders
    .create(params)
    .then((data) => {
      res.send({ sub: data, status: "success" });
    })
    .catch((error) => {
      res.send({ sub: error, status: "failed" });
    });
};

exports.verifyPaymentOrder = async (req, res) => {
  body =
    req.body.paymentmethod.razorpay_order_id +
    "|" +
    req.body.paymentmethod.razorpay_payment_id;
  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "U4iA3CaZoEwZEP8lXa4OVid6")
    .update(body.toString())
    .digest("hex");
  console.log("sig" + req.body.paymentmethod.razorpay_signature);
  console.log("sig" + expectedSignature);
  var response = { status: "failure" };

  if (expectedSignature === req.body.paymentmethod.razorpay_signature) {
    response = { status: "success" };

    req.body.paymentmethod.rzr_pay_status = response;
    req.body.paymentmethod.pay_status = "pending";

    try {
      const Buy_Item = ShopProduct({
        buyerid: req.user._id,
        buyername: req.user.username,
        ...req.body,
      });

      Buy_Item.save().then(async (result) => {
        var noti_to_seller = await SellerNoti(
          req.body.sellername,
          "order",
          "Product Has Been Requested by " + req.user.username
        );
        var noti_to_buyer = await BuyerNoti(
          req.user.username,
          "order",
          "Product Requested waiting For Shop To Accept Your Order"
        );
        res.json({ data: result, res: response });
      });
    } catch (error) {
      console.log(error);
      return res.status(402).send({ error });
    }
  }
};

exports.buyProduct = async (req, res) => {
  if (req.user.role != "basic") {
    return res
      .status(404)
      .send({ msg: "Login as customer to buy products to cart" });
  }

  try {
    const Buy_Item = ShopProduct({
      buyerid: req.user._id,
      buyername: req.user.username,
      ...req.body,
    });

    Buy_Item.save().then(async (result) => {
      var noti_to_seller = await SellerNoti(
        req.body.sellername,
        "order",
        "Product Has Been Requested by " + req.user.username
      );
      var noti_to_buyer = await BuyerNoti(
        req.user.username,
        "order",
        "Product Requested waiting For Shop To Accept Your Order"
      );
      res.json({ data: result });
    });
  } catch (error) {
    console.log(error);
    return res.status(402).send({ error });
  }
};

exports.filterProdByCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const productsByCategory = await Product.find({ category, active: true });
    if (productsByCategory.length === 0) throw "No Products of this Category";
    return res.json({ productsByCategory });
  } catch (e) {
    return res.status(402).send({ error: e });
  }
};

exports.addProdReview = async (req, res) => {
  if (req.user.role != "basic") {
    return res.status(404).send({ msg: "Login as customer to give a review" });
  }
  try {
    const { _id } = req.user;
    const { product_id, ratings, comments } = req.body;
    const query = { _id: product_id, active: true };
    const update = {
      $addToSet: {
        reviews: {
          customer_id: _id,
          ratings,
          comments,
          time: new Date(),
        },
      },
    };
    const options = { new: true };
    await Product.findOneAndUpdate(query, update, options, (err, product) => {
      if (err) return res.status(500).send(err);
      const response = {
        message: "Product Review added",
        data: product,
      };
      return res.status(200).send(response);
    });
  } catch (error) {
    return res.status(402).json({ error });
  }
};

exports.getRatings = async (req, res) => {
  try {
    const { product_id } = req.body;
    const product = await Product.findOne({ _id: product_id, active: true });
    const length = product.reviews.length;
    if (length === 0) res.json({ msg: "No Reviews" });
    const avg_reviews =
      product.reviews.reduce((prev, curr) => prev + curr.ratings, 0) / length;
    res.json({ avg_reviews, length });
  } catch (error) {
    return res.status(402).json({ error });
  }
};

exports.updateProdReview = async (req, res) => {
  if (req.user.role != "basic") {
    return res.status(404).send({ msg: "Login as customer to give a review" });
  }
  try {
    const { _id } = req.user;
    const { product_id, ratings, comments } = req.body;
    await SellerProfile.findOneAndUpdate(
      { _id: product_id, "reviews.customer_id": _id, active: true },
      {
        $set: {
          "reviews.$.ratings": ratings,
          "reviews.$.comments": comments,
          "reviews.$.time": new Date(),
        },
      },
      { new: true },
      function (err, product) {
        if (err) return res.status(500).send(err);
        const response = {
          message: "Product Review Updated",
          data: product,
        };
        return res.status(200).send(response);
      }
    );
  } catch (error) {
    return res.send(401).json({ error });
  }
};
