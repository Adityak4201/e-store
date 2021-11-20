const express = require("express");
const SuperAdminController = require("../controllers/superAdmin");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/getSellerOrders", auth, SuperAdminController.getSellerOrders);
router.post(
  "/getOrdersForSellerByLimit",
  auth,
  SuperAdminController.getBuyerOrdersForSellersByLim
);
router.get(
  "/changeOrderPayStatus/:id",
  auth,
  SuperAdminController.changePaymentOrderStatus
);
