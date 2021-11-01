const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = Schema({
  coverImage: {
    type: Array,
    default: [],
  },
  username: {
    type: String,
  },
  user_id: {
    type: String,
  },
  productname: {
    type: String,
  },
  productmetadescription: {
    type: String,
  },
  category: { type: String },
  productdescription: {
    type: String,
  },
  price: {
    type: Number,
  },
  sellprice: {
    type: Number,
  },
  variation: { type: Array, default: [] },
  inventory: {
    type: Number,
  },
  SKU: {
    type: String,
  },
  Item_Returnable: { type: Number },
  reviews: { type: Array, default: [] },
  active: { type: Boolean, default: false },
});

module.exports = mongoose.model("Product", Product);
