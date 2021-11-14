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

router.get("/getSubs", async (req, res) => {
  Subs.find({}, (err, result) => {
    if (err) {
      res.status(404).json({ error: err });
    }

    res.status(200).json({ subs: result });
  });
});

router.get("/getSub/:id", async (req, res) => {
  Subs.find({ _id: req.params.id }, (error, result) => {
    if (err) {
      res.status(404).json({ err: err });
    }

    res.status(200).json({ subs: result });
  });
});

module.exports = router;
