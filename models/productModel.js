const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = Schema({
  coverImage: {
    type: String,
    default: "",
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
  Item_Returnable: { type: Number },
  comments: { type: Array, default: [] },
});

module.exports = mongoose.model("Product", Product);
