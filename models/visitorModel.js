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
>>>>>>> e142993e275cf9fa4461db50b1156b81f4911937
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", Visitor);
