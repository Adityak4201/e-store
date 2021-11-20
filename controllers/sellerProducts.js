const Product = require("../models/productModel");
const ShopProduct = require("../models/shoppingModel");
const SellerNoti = require("../middleware/seller_noti");
const BuyerNoti = require("../middleware/buyer_noti");
const checkSubs = require("../middleware/checkSubscription");

exports.getSellerUsername = async (req, res) => {
  if (req.user.role != "admin") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a seller account" });
  }
  res.send(req.user.username);
};

exports.uploadProductImages = async (req, res) => {
  // console.log("upload image");
  const { id } = req.body;
  // await compress(req.file.filename);
  // console.log(req.files);
  const reqFiles = [];
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push("/products/" + req.files[i].filename);
  }

  await Product.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        coverImage: reqFiles,
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

exports.deleteCoverImg = async (req, res) => {
  if (req.user.role != "admin") {
    return res
      .status(404)
      .json({ error: "Login first to delete product images" });
  }

  const { id, image_path } = req.body;
  await Product.findOneAndUpdate(
    { _id: id },
    { $pull: { coverImage: image_path } },
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

exports.addProduct = async (req, res) => {
  if (req.user.role != "admin") {
    return res
      .status(404)
      .json({ error: "You can't add profile create a seller account" });
  }
  console.log(req.user, req.body);

  const check = await checkSubs(req.user.username);
  if (check == false) {
    return res.status(404).send({ msg: "Plz Buy A Subscription Plan" });
  }

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
    active,
    SKU,
  } = req.body;
  const Item = Product({
    productname,
    username,
    productmetadescription,
    productdescription,
    price,
    sellprice,
    variation,
    active,
    inventory,
    Item_Returnable,
    category,
    SKU,
  });

  Item.save()
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    });
};

exports.addSKU = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).send({ msg: "create a seller account to view" });
  }
  await Product.findOneAndUpdate(
    { _id: req.params.id },
    { SKU: req.body.SKU },
    (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
    }
  );
};

exports.getSKU = async (req, res) => {
  await Product.findOne({ _id: req.params.id }, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};

exports.getProductsList = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).send({ msg: "create a seller account to view" });
  }
  await Product.find({ username: req.user.username }, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};

exports.getProdByLimit = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startindex = (page - 1) * limit;
  const posts = await Product.find({ username: req.user.username })
    .limit(limit)
    .skip(startindex)
    .exec();
  res.send(posts);
};

exports.deleteProduct = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).send({ msg: "create a seller account to view" });
  }

  await Product.findOneAndDelete(
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
};

exports.editProductDetails = async (req, res) => {
  if (req.user.role != "admin") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a seller account" });
  }

  await Product.findOneAndUpdate(
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
};

exports.toggleActive = async (req, res) => {
  await Product.findOneAndUpdate(
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
};

exports.activeAll = async (req, res) => {
  await Product.updateMany(
    {},
    {
      $set: {
        active: true,
      },
    },
    (err, result) => {
      if (err) return res.status(403).json({ error: err });
      return res.json({ data: result });
    }
  );
};

exports.updateStatus = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).send({ msg: "Login to update order status" });
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
    .then(async (updatedOrder) => {
      if (!updatedOrder) {
        return res
          .status(402)
          .json({ error: "Order has been rejected/cancelled" });
      }
      var noti_to_seller = await SellerNoti(
        req.user.username,
        "order",
        "Product Status Has been updated to " + status
      );
      var noti_to_buyer = await BuyerNoti(
        updatedOrder.buyername,
        "order",
        "Product has been " + status
      );
      res.send({ updatedOrder });
    })
    .catch((error) => {
      if (error) return res.status(403).json({ error: error });
      else res.status(404).json({ error: "No order found" });
    });
};

exports.searchOrdersByDate = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).send({ msg: "Login to search orders" });
  }
  const { str } = req.body;
  str = new Date(str);
  try {
    const orders = await ShopProduct.find({
      date: { $regex: str },
      sellerid: req.user.username,
    });

    if (!orders.length) throw "No Orders Found";
    return res.json({ orders });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};

exports.searchOrdersByBuyerName = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).send({ msg: "Login to search orders" });
  }
  const { str } = req.body;
  try {
    const orders = await ShopProduct.find({
      buyername: { $regex: str },
      sellerid: req.user.username,
    });

    if (!orders.length) throw "No Orders Found";
    return res.json({ orders });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};
