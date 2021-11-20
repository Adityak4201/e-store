const Subs = require("../models/sellerSubscriptionModel");

exports.createSubscription = async (req, res) => {
  const newSubPlan = new Subs({
    ...req.body,
  });

  await newSubPlan
    .save()
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err), res.json({ err });
    });
};

exports.getAllSubscriptions = async (req, res) => {
  await Subs.find({}, (err, result) => {
    if (err) {
      res.status(404).json({ error: err });
    }

    res.status(200).json({ subs: result });
  });
};

exports.getSubscriptionById = async (req, res) => {
  await Subs.find({ _id: req.params.id }, (error, result) => {
    if (err) {
      res.status(404).json({ err: err });
    }

    res.status(200).json({ subs: result });
  });
};
