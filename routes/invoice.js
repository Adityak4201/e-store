const express = require("express");
const {
  addInvoice,
  getAllInvoices,
  getBuyersInvoice,
} = require("../controllers/invoice");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/addInvoice", auth, addInvoice);
router.get("/getInvoices", auth, getAllInvoices);
router.post("/getBuyersInvoices", auth, getBuyersInvoice);

module.exports = router;
