const Invoice = require("../models/invoiceModel");

exports.addInvoice = async (req, res) => {
  if (req.user.role != "admin") {
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
      // console.log(invoiceAdded);
      return res.send({ invoiceAdded });
    })
    .catch((error) => {
      console.log(error);
      return res.status(403).json({ error });
    });
};

exports.getAllInvoices = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).send({ msg: "Login to see invoices" });
  }
  try {
    const { username } = req.user;
    // console.log(req.user);
    const seller = await Invoice.findOne({ seller_username: username });
    console.log(seller);
    if (!seller && !seller.invoices && seller.invoices.length === 0)
      throw "No Invoices";
    // console.log(buyersList);
    return res.json({ invoices: seller.invoices });
  } catch (error) {
    return res.status(403).json({ error });
  }
};

exports.getBuyersInvoice = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).send({ msg: "Login to see invoices" });
  }
  try {
    const { c_username } = req.body;
    const { username } = req.user;
    const buyersInvoice = await Invoice.findOne({
      seller_username: username,
      "invoices.username": c_username,
    });
    if (!buyersInvoice) throw "No Invoice Found!!";
    return res.json({ invoice: buyersInvoice });
  } catch (error) {
    return res.status(403).json({ error });
  }
};
