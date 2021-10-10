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
<<<<<<< HEAD
    }
=======
    },
>>>>>>> 4bceb5fbf4038d8fac352f3f70a3a10a8c4dcb58
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", Visitor);
