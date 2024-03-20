const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: false,
    },

    address: {
      type: String,
      required: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    registerToken: {
      type: String,
    },

    registerTokenExpiration: {
      type: Date,
    },

    resetOTP: {
      type: String,
    },

    resetOTPExpiration: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("User", userSchema);
