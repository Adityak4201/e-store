const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Seller_Profile = Schema({
  ordertype: {
    type: String,
    required:true

  },
  sellerid: {
    type: String,
    required:true

  },
  buyerid: {
    type: String,
    required:true

  },
  buyername: {
    type: String,
    required:true

  },
  buyeraddress: {
    type: String,
  },
  buyerphone: {
    type: String,
    required:true

  },
  paymentmethod: {
    type: Array,
    default : [],
    required:true

  },
  subtotal: {
    type: number,
    required:true

  },
  shippingcost: {
    type: number,
    required:true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: string,
    default: "ordered",
  },
});

module.exports = mongoose.model("Seller_Profile", Seller_Profile);
