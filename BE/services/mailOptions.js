const mail = require("./mail");

// const sendLinkVerificationEmail = async (user, verificationLink) => {
//   const mailOptions = {
//     from: "manhha2392000@gmail.com",
//     to: user.email,
//     subject: "Verify email address",
//     text: `Hello,\n\nPlease click on the link below to verify your account:\n\n${verificationLink}\n\nThis link will expire in 1 hour.\n\nBest regards`,
//   };

//   await mail.sendMail(mailOptions);
// };

// const sendOTP = async (user, otp) => {
//   const mailOptions = {
//     from: "manhha2392000@gmail.com",
//     to: user.email,
//     subject: "Reset Password",
//     text: `Hello,\n\nYou have requested to reset your password. Please use the following OTP to reset your password:\n\n${otp}\n\nThis OTP will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards`,
//   };

//   await mail.sendMail(mailOptions);
// };

module.exports = { sendLinkVerificationEmail, sendOTP };
