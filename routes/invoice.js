const express = require("express");
const router = express.Router();
const Invoice = require("../models/invoiceModel");
const auth = require("../middleware/auth");

router.post("/addInvoice", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "Login to add invoice!!" });
  }
  const { c_username, invoice, c_name, c_email, c_phone } = req.body;
  //   console.log(req.body.product_id);
  const { username } = req.user;
  await Invoice.findOneAndUpdate(
    { seller_username: username },
    {
      $addToSet: {
        invoices: {
          username: c_username,
          email: c_email,
          phone: c_phone,
          name: c_name,
          invoice,
        },
      },
    },
    { new: true, upsert: true }
  )
    .then((invoiceAdded) => {
      console.log(invoiceAdded);
      return res.send({ invoiceAdded });
    })
    .catch((error) => {
      console.log(error);
      return res.status(403).json({ error });
    });
});

router.get("/getInvoices", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "Login to see invoices" });
  }
  try {
    const { seller_username } = req.user;
    const seller = await Invoice.findOne({ seller_username });
    if (!seller || !seller.visitor_info || seller.invoices.length === 0)
      throw "No Invoices";
    // console.log(buyersList);
    return res.json({ invoices: seller.invoices });
  } catch (error) {
    return res.status(403).json({ error });
  }
});

module.exports = router;
