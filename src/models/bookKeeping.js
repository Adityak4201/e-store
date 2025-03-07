const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Book_Keeping = new Schema({
  email: {
    type: String,
    unique: true,
  },
  khata: [
    {
      p_name: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        required: true,
      },
      give_take: {
        type: String,
        enum: ["give", "take"],
      },
      time: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model("Book_Keeping", Book_Keeping);
