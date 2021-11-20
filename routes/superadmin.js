const express = require("express");
const {
  getSellerOrders,
  getBuyerOrdersForSellersByLim,
  changePaymentOrderStatus,
} = require("../controllers/superAdmin");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/getSellerOrders", auth, getSellerOrders);
router.post("/getOrdersForSellerByLimit", auth, getBuyerOrdersForSellersByLim);
router.get("/changeOrderPayStatus/:id", auth, changePaymentOrderStatus);
