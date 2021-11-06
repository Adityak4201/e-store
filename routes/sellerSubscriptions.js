const express = require("express");
const router = express.Router();
const Subs = require("../models/sellerSubscriptionModel");
const auth = require("../middleware/auth");

router.post("/createSub", async (req, res) => {
  const newSubPlan = new Subs({
    ...req.body,
  });

  newSubPlan
    .save()
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err), res.json({ err });
    });
});

module.exports = router;

