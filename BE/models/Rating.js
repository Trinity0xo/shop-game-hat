const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },

    users: {
      type: Array,
    },

    avgRating: {
      type: Number,
      default: 0.0,
    },

    totalRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("Rating", RatingSchema);
