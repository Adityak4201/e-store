const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Profile = Schema({
  profileimg: {
    type: String,
    default: "",
  },
  username: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: { type: Array, default: [] },
  details: {
    type: String,
  },
  dob: {
    type: Date,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },

  cart: { type: Array, default: [] },
  items: { type: Array, default: [] },
  noti: { type: Array, default: [] },
});

module.exports = mongoose.model("Profile", Profile);
