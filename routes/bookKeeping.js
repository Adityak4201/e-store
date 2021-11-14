const express = require("express");
const router = express.Router();
const BookKeeping = require("../models/bookKeeping");
const auth = require("../middleware/auth");

router.post("/addStatement", auth, async (req, res) => {
  const { p_name, amount, give_take } = req.body;
  const { email } = req.user;

  await BookKeeping.findOneAndUpdate(
    {
      email,
    },
    { $addToSet: { khata: { p_name, amount, give_take } } },
    { new: true, upsert: true }
  )
    .then((statementAdded) => {
      // console.log(statementAdded);
      if (!statementAdded)
        return res.status(404).json({ error: "Email already exists" });
      return res.send({ statementAdded });
    })
    .catch((error) => {
      //   console.log(error);
      return res.status(404).json({ error });
    });
});

router.post("/updateStatement", auth, async (req, res) => {
  const { id, p_name, amount, give_take } = req.body;
  const { email } = req.user;
  await BookKeeping.findOneAndUpdate(
    {
      email,
      "khata._id": id,
    },
    { $set: { "khata.$": { p_name, amount, give_take } } },
    { new: true }
  )
    .then((statementUpdated) => {
      //   console.log(statementUpdated);
      if (!statementUpdated)
        return res
          .status(404)
          .json({ error: "Statement not found with given email" });
      return res.send({ statementUpdated });
    })
    .catch((error) => {
      return res.status(404).json({ error: "No Statement Found" });
    });
});

router.delete("/deleteStatement/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { email } = req.user;
  await BookKeeping.updateOne(
    {
      email,
    },
    { $pull: { khata: { _id: id } } }
  )
    .then((deleted) => {
      console.log(deleted);
      return res.json({ msg: "Account Statement with given email deleted" });
    })
    .catch((error) => {
      return res.status(403).json({ error });
    });
});

router.get("/viewStatement", auth, async (req, res) => {
  try {
    const { email } = req.user;
    const accountStatement = await BookKeeping.findOne({ email });
    if (!accountStatement) throw "Account Statement not found";
    return res.json({ accountStatement });
  } catch (error) {
    return res.status(403).json({ error });
  }
});

module.exports = router;
