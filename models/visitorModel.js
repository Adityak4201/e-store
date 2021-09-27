const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Visitor = new Schema(
  {
    seller_username: {
      type: String,
      required: true,
    },
    visitor_info: {
      type: Array,
      default: [],
      required: true,
    },
    // name: {
    //     type: String,
    //     required: true,
    // },
    // phone: {
    //     type: String,
    //     required: true
    // },
    // product_id: {
    //     type: String,
    //     required: true,
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", Visitor);
