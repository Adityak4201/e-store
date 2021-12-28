const Profile = require("../models/profileModel");
const ShopProduct = require("../models/shoppingModel");
const Product = require("../models/productModel");
const SellerProfile = require("../models/sellerModel");
const message_Seller = require("../models/messageModel");

exports.homeRoute = async (req, res) => {
  res.send({ msg: "Get Your profile", role: req.user.role });
};

exports.uploadProfileImg = async (req, res) => {
  if (req.user.role !== "basic") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a basic account" });
  }
  await Profile.findOneAndUpdate(
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
};

exports.getProfile = async (req, res) => {
  if (req.user.role !== "basic")
    return res
      .status(403)
      .json({ error: "Log in as buyer to view your profile" });

  const username = req.user.username;
  await Profile.findOne({ username }, function (err, docs) {
    if (err) {
      console.log(err);
      return res.status(404).json({ error: err });
    } else {
      console.log("Result : ", docs);
      return res.json(docs);
    }
  });
};

exports.addProfileInfo = async (req, res) => {
  if (req.user.role !== "basic") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a basic account" });
  }

  await Profile.findOneAndUpdate(
    {
      username: req.user.username,
    },
    { ...req.body },
    { new: true, upsert: true }
  )
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err });
    });
};

exports.editAddress = async (req, res) => {
  if (req.user.role !== "basic") {
    return res
      .status(404)
      .send({ msg: "You can't edit address. Create an account first!!" });
  }

  const { address } = req.body;

  await Profile.findOneAndUpdate(
    { username: req.user.username, "address._id": address._id },
    {
      $set: {
        "address.$.add_type": address.add_type,
        "address.$.fullName": address.fullName,
        "address.$.houseNo": address.houseNo,
        "address.$.landmark": address.landmark,
        "address.$.street": address.street,
        "address.$.city": address.city,
        "address.$.state": address.state,
        "address.$.country": address.country,
        "address.$.pincode": address.pincode,
        "address.$.phone": address.phone,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).json({ error: err });
      }
      return res.json(result);
    }
  );
};

exports.addAddress = async (req, res) => {
  if (req.user.role !== "basic") {
    return res
      .status(404)
      .send({ msg: "You can't add address. Create an account first!!" });
  }

  const { address } = req.body;

  await Profile.findOneAndUpdate(
    { username: req.user.username },
    {
      $push: {
        address: address,
      },
    },
    { new: true }
  )
    .then((response) => {
      return res.json({ profile: response });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ error: err });
    });
};

exports.getAddressDetails = async (req, res) => {
  try {
    await Profile.find(
      { username: req.user.username },
      "address",
      function (err, result) {
        if (err) return res.status(403).send(err);
        return res.json(result);
      }
    );
  } catch (error) {
    console.log(err);
    return res.status(404).json({ error: err });
  }
};

exports.deleteAddress = async (req, res) => {
  if (req.user.role !== "basic") {
    return res
      .status(404)
      .send({ msg: "You can't delete address. Create an account first!!" });
  }
  const { _id } = req.query;
  const { username } = req.user;
  await Profile.updateOne(
    {
      username,
    },
    { $pull: { address: { _id } } }
  )
    .then((deleted) => {
      // console.log(deleted);
      return res.json({ msg: "Address Deleted" });
    })
    .catch((error) => {
      return res.status(403).json({ error });
    });
};

exports.getShopsByLim = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startindex = (page - 1) * limit;
  const shops = await SellerProfile.find({})
    .limit(limit)
    .skip(startindex)
    .exec();
  res.json(shops);
};

exports.getAllShops = async (req, res) => {
  const shops = await SellerProfile.find({});
  res.json(shops);
};

exports.filterBySellerCategory = async (req, res) => {
  const category = req.body.category;
  try {
    SellerProfile.find({ business_category: category }, function (err, result) {
      if (err) return res.status(403).json({ error: err });
      return res.json(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(402).json({ error: err });
  }
};

exports.searchByProduct = async (req, res) => {
  const { str } = req.body;
  try {
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

    if (!products.length) throw "No Products Found";

    return res.json({ products });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};

exports.searchByShops = async (req, res) => {
  const { str } = req.body;
  try {
    const shops = await SellerProfile.find({
      $or: [
        {
          business_name: { $regex: str },
        },
        {
          business_category: { $regex: str },
        },
      ],
    });
    if (!shops.length) throw "No Shops Found";

    return res.json({ shops });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};

exports.sendMsgToSeller = async (req, res) => {
  try {
    const sentMessage = message_Seller({
      by: req.user.username,
      to: req.body.message_to,
      message: req.body.message,
    });

    await sentMessage
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
};

exports.getProfileImg = async (req, res) => {
  try {
    var img1 = await Profile.findOne(
      { username: req.params.username },
      "profileimg"
    ).exec();

    var img2 = await SellerProfile.findOne(
      { username: req.params.username },
      "profileimg"
    ).exec();

    var img = "";
    if (img1 == null) {
      img = img2;
    }

    if (img2 == null) {
      img = img1;
    }
    res.status(202).json({ profilepic: img });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

exports.findBuyerMsg = async (req, res) => {
  try {
    await message_Seller.find(
      { $or: [{ to: req.user.username }, { by: req.user.username }] },
      function (err, result) {
        if (err) return res.status(403).send(err);
        return res.json(result);
      }
    );
  } catch (err) {
    console.log(err), res.json({ err: err });
  }
};

exports.findBuyerSellerMsg = async (req, res) => {
  try {
    await message_Seller.find(
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
};

exports.recentChats = async (req, res) => {
  try {
    const response = await message_Seller
      .find(
        { $or: [{ to: req.user.username }, { by: req.user.username }] },
        "by to"
      )
      .sort({ date: -1 })
      .exec();

    const lastmessaged = [];
    response.forEach((element) => {
      if (
        (element["by"] == req.user.username) &
        (lastmessaged.indexOf(element["to"]) === -1)
      ) {
        lastmessaged.push(element["to"]);
      }

      if (
        (element["to"] == req.user.username) &
        (lastmessaged.indexOf(element["by"]) === -1)
      ) {
        lastmessaged.push(element["by"]);
      }
    });

    console.log("lastmessaged", lastmessaged);
    var recentMessages = [];
    var j = 0;
    for (let i = 0; i < lastmessaged.length; i++) {
      var message = await message_Seller
        .findOne({
          $or: [
            { to: req.user.username, by: lastmessaged[i] },
            { to: lastmessaged[i], by: req.user.username },
          ],
        })
        .sort({ date: -1 })
        .exec();

      if (message != null) {
        recentMessages[j] = message;
        j++;
      }
    }

    res.json({ response: lastmessaged, recentMessages: recentMessages });
  } catch (err) {
    console.log(err), res.json({ err: err });
  }
};

exports.distinctChatUsers = async (req, res) => {
  try {
    await message_Seller
      .find({ by: req.user.username }, "to")
      .distinct("to", async function (err, result) {
        if (err) return res.status(403).send(err);
        return res.json(result);
      });
  } catch (err) {
    console.log(err), res.json({ err: err });
  }
};

exports.addShopReview = async (req, res) => {
  if (req.user.role != "basic") {
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
          time: new Date(),
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
};

exports.getShopRatings = async (req, res) => {
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
};

exports.updateShopReview = async (req, res) => {
  if (req.user.role != "basic") {
    return res.status(404).send({ msg: "Login as customer to give a review" });
  }
  try {
    const { _id } = req.user;
    const { shop_id, ratings, comments } = req.body;
    await SellerProfile.findOneAndUpdate(
      { _id: shop_id, "reviews.customer_id": _id },
      {
        $set: {
          "reviews.$.ratings": ratings,
          "reviews.$.comments": comments,
          "reviews.$.time": new Date(),
        },
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
};

exports.cancelOrder = async (req, res) => {
  if (req.user.role != "basic") {
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
    .then(async (cancelledOrder) => {
      if (!cancelledOrder)
        return res
          .status(402)
          .json({ error: "Order has been already rejected/cancelled" });

      const seller = await SellerProfile.findOne({
        _id: cancelledOrder.sellerid,
      });
      var noti_to_seller = SellerNoti(
        seller.username,
        "order",
        "Product Status Has been updated to " + status
      );
      var noti_to_buyer = BuyerNoti(
        req.user.username,
        "order",
        "Product has been " + status + " by the seller"
      );
      return res.send({ cancelledOrder });
    })
    .catch((error) => {
      if (error.errors) return res.status(403).json({ error: error.errors });
      else res.status(404).json({ error: "No order found" });
    });
};

exports.getBuyersOrders = async (req, res) => {
  if (req.user.role !== "basic") {
    return res.status(404).send({ msg: "Login to get orders list" });
  }
  const { _id } = req.user;
  try {
    const orders = await ShopProduct.find({
      buyerid: _id,
    });

    if (!orders.length) throw "No Orders Found";
    return res.json({ orders });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};

exports.filterShopsByLocation = async (req, res) => {
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
};
