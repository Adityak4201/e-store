const Visitor = require("../models/visitorModel");

exports.addVisitor = async (req, res) => {
  if (req.user.role != "basic") {
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
};

exports.getVisitorsForSeller = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).send({ msg: "Login to see visitors list" });
  }
  try {
    const { seller_username } = req.user;
    const visitors = await Visitor.find({ seller_username });
    if (!visitors || !visitors.length) throw "No Visitors";
    // console.log(buyersList);
    return res.json({ visitors });
  } catch (error) {
    return res.status(403).json({ error });
  }
};

exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find();
    // console.log(visitors);
    if (!visitors || !visitors.length) throw "No Visitors right now!!";
    return res.json({ visitors });
  } catch (error) {
    // console.log(error);
    return res.status(403).json({ error });
  }
};
