const crypto = require("crypto");

const randomBytes = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

module.exports = randomBytes;
