const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const message_Seller = Schema({
  by: {
    type: String,
    required: true,

  },
  to: {
    type: String,
    required: true,

  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }

});

module.exports = mongoose.model("message_Seller", message_Seller);
