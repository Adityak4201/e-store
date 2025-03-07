const Profile = require("../models/sellerModel");
const ShopProduct = require("../models/shoppingModel");

exports.getSellerOrders = async (req, res) => {
  if (req.user.role != "superadmin") {
    return res.status(404).json({ error: "No permission see orders' list" });
  }

  try {
    const { username } = req.body;
    const seller = await Profile.findOne({ username });
    const ordersList = await ShopProduct.find({ sellerid: seller._id });
    if (!ordersList || ordersList.length === 0) throw "No Orders";
    return res.json({ ordersList });
  } catch (error) {
    return res.status(403).json({ error });
  }
};

exports.getBuyerOrdersForSellersByLim = async (req, res) => {
  if (req.user.role != "superadmin") {
    return res.status(404).json({ error: "No permission see orders' list" });
  }
  try {
    const { buyerid, page, limit } = req.body;
    const startindex = (parseInt(page) - 1) * parseInt(limit);
    const { username } = req.body;
    const seller = await Profile.findOne({ username });
    const ordersList = await ShopProduct.find({ sellerid: seller._id, buyerid })
      .limit(limit)
      .skip(startindex)
      .exec();
    if (!ordersList || ordersList.length === 0) throw "No Orders";
    return res.json({ ordersList });
  } catch (error) {
    return res.status(403).json({ error });
  }
};

exports.changePaymentOrderStatus = async (req, res) => {
  if (req.user.role != "superadmin") {
    return res.status(404).json({ error: "No permission see orders' list" });
  }

  await ShopProduct.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { "paymentmethod.pay_status": req.body.new_pay_status } },
    { new: true }
  )
    .then((updatesPayStatus) => {
      return res.send({ msg: "Order status Updated", updatesPayStatus });
    })
    .catch((error) => {
      return res.status(404).json({ error: "No Order Found" });
    });
};
