require("dotenv").config();

exports.env = {
  TOKEN_EXPIRE: process.env.TOKEN_EXPIRE || "5m",
  OTP_EXPIRE: process.env.OTP_EXPIRE || "5m",

  SERVER_HOST: process.env.SERVER_HOST || "localhost",
  SERVER_PORT: process.env.SERVER_PORT || 8080,

  JWT_SECRET: process.env.JWT_SECRET || "123456",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "1d",

  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/shop-game",
};
