const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellerSubscription = Schema({
  subsName: {
    type: String,
  },
  SubsAmount: {
    type: Number,
  },
  description : {
      type : String
  },

  endtime : { type : Number},
  AvailableOptions: { type: Array, default: [] },
  RestrictedOptions: { type: Array, default: [] },
  Additionaldetails: { type: Array, default: [] },

});

module.exports = mongoose.model("SellerSubscription", SellerSubscription);
