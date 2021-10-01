const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Invoice = new Schema(
  {
    seller_username: {
      type: String,
      required: true,
    },
    invoices: {
      type: Array,
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", Invoice);
