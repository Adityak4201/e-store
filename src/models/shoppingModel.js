const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShopProduct = Schema({
  ordertype: {
    type: String,
    required: true,
  },
  productdetails: {
    type: Array,
    default: [],
    required: true,
  },
  sellerid: {
    type: String,
    required: true,
  },
  buyerid: {
    type: String,
    required: true,
  },
  buyername: {
    type: String,
    required: true,
  },
  buyeraddress: {
    type: String,
  },
  buyerphone: {
    type: String,
    required: true,
  },
  paymentmethod: {
    type: Object,
    default: {},
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  shippingcost: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected","shipped", "packed","delivered","returned","cancelled"],
    default: "pending",
  },

  trackorder: {
    type: Array,
    default: [],
    required: true,
  },
});

module.exports = mongoose.model("ShopProduct", ShopProduct);
