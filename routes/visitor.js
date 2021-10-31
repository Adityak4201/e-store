const express = require("express");
const router = express.Router();
const Visitor = require("../models/visitorModel");
const auth = require("../middleware/auth");

router.post("/addVisitor", auth, async (req, res) => {
  if (req.user.roll != "basic") {
    return res
      .status(404)
      .send({ msg: "Visitor can only be added after he is signed in!!" });
  }

  const { email } = req.user;
  const visitor = new Visitor({
    ...req.body,
    visitor_email: email,
  });
  await visitor
    .save()
    .then((visitorAdded) => {
      console.log(visitorAdded);
      return res.send({ visitorAdded });
    })
    .catch((error) => {
      console.log(error);
      return res.status(403).json({ error });
    });
});

router.get("/getVisitors", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "Login to see visitors list" });
  }
  try {
    const { seller_username } = req.user;
    const seller = await Visitor.findOne({ seller_username });
    if (!seller || !seller.visitor_info || seller.visitor_info.length === 0)
      throw "No Visitors";
    // console.log(buyersList);
    return res.json({ visitors: seller.visitor_info });
  } catch (error) {
    return res.status(403).json({ error });
  }
});

module.exports = router;
