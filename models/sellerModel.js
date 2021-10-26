const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Seller_Profile = Schema({
  profileimg: {
    type: String,
    default: "",
  },
  username: {
    type: String,
  },
  bussiness_name: {
    type: String,
  },
  bussiness_category: {
    type: String,
  },
  phone: {
    type: Number,
  },
  address: { type: Array, default: [] },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  details: {
    about: { type: String },
    return_policy: { type: String },
  },
  extra_charges: {
    type: Array,
    default: [],
  },
  reviews: { type: Array, default: [] },
  noti: { type: Array, default: [] },
});

module.exports = mongoose.model("Seller_Profile", Seller_Profile);
