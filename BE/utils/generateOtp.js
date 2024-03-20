const otpGenerator = require("otp-generator");

const generateOtp = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

module.exports = generateOtp;
