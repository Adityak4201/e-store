const express = require("express");
const router = express.Router();
const SubscriptionController = require("../controllers/sellerSubscription");

router.post("/createSub", SubscriptionController.createSubscription);
router.get("/getSubs", SubscriptionController.getAllSubscriptions);
router.get("/getSub/:id", SubscriptionController.getSubscriptionById);

module.exports = router;
