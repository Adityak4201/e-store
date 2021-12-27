const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Profile = Schema({
  profileimg: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
  },
  address: [
    {
      add_type: String,
      fullName: String,
      houseNo: String,
      landmark: String,
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: Number,
      phone: Number,
    },
  ],
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
