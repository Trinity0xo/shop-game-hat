const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../response/ErrorResponse");
const randomBytes = require("../utils/randomBytes");
const { env } = require("../config/env");
const otpGenerator = require("../utils/generateOtp");
const ms = require("ms");
const jwt = require("jsonwebtoken");
const emailService = require("../services/nodeMailer");
const fs = require("fs");
const ejs = require("ejs");

// ========== register ========== //

const register = asyncMiddleware(async (req, res, next) => {
  const { name, email, password } = req.body;

  const isExistedEmail = await User.findOne({ email });
  if (isExistedEmail) {
    throw ErrorResponse(409, "Email đã tồn tại");
  }

  const salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const registerToken = randomBytes(23);
  const registerTokenExpiration = Date.now() + ms(env.TOKEN_EXPIRE);

  const link = `http://${env.SERVER_HOST}:${env.SERVER_PORT}/api/v1/auth/verify-email?token=${registerToken}`;

  emailService({
    to: email,
    subject: "Xác thực email",
    html: `<h3>Nhấn vào <a href="${link}">đây</a> để hoàn thành việc xác thực email</h3>`,
  });

  const user = new User({
    name,
    email,
    password: hashedPassword,
    registerToken,
    registerTokenExpiration,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: "Đăng ký tại khoản thành công vui lòng kiểm tra email để xác thực",
  });
});

// ========== login ========== //

const login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw ErrorResponse(401, "Email hoặc mật khẩu không đúng");
  }

  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ErrorResponse(401, "Email hoặc mật khẩu không đúng");
  }

  if (!user.isVerified) {
    const registerToken = randomBytes(23);
    const registerTokenExpiration = Date.now() + ms(env.TOKEN_EXPIRE);

    const link = `http://${env.SERVER_HOST}:${env.SERVER_PORT}/api/v1/auth/verify-email?token=${registerToken}`;

    await Promise.all([
      user.updateOne({ registerToken, registerTokenExpiration }),
      emailService({
        to: email,
        subject: "Xác thực email",
        html: `<h4>Nhấn vào <a href="${link}">đây</a> để hoàn thành việc xác thực email</h4>`,
      }),
    ]);

    return res.json({
      success: false,
      message:
        "Tài khoản chưa xác thực, vui lòng kiểm tra email để xác thực tài khoản",
    });
  }

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });

  res.json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    token,
  });
});

// ========== verify email ========== //

const verifyEmail = asyncMiddleware(async (req, res, next) => {
  const { token } = req.query;

  const user = await User.findOne({ registerToken: token });
  if (!user) {
    const template = fs.readFileSync("views/verify-fail.ejs", "utf-8");
    const html = ejs.render(template);
    return res.status(404).send(html);
  }

  if (user.registerToken && user.registerTokenExpiration < Date.now()) {
    const template = fs.readFileSync("views/verify-fail.ejs", "utf-8");
    const html = ejs.render(template);
    return res.status(400).send(html);
  }

  user.isVerified = true;
  user.registerToken = "";
  user.registerTokenExpiration = "";

  await user.save();

  const template = fs.readFileSync("views/verify-email.ejs", "utf-8");
  const html = ejs.render(template, { username: user.name });

  res.status(200).send(html);
});

// ========== resend verify email ========== //

const resendVerifyLink = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy tài khoản");
  }

  if (user.isVerified) {
    throw ErrorResponse(400, "Tài khoản đã xác thực");
  }

  user.registerToken = randomBytes(23);
  user.registerTokenExpiration = Date.now() + env.TOKEN_EXPIRE;

  await user.save();

  res.json({
    success: true,
    message: "Gửi lại email xác thực thành công",
  });
});

// ========== forgot password ========== //

const forgotPassword = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy tài khoản");
  }

  user.resetOTP = otpGenerator();
  user.resetOTPExpiration = Date.now() + ms(env.OTP_EXPIRE);

  await Promise.all([
    emailService({
      to: email,
      subject: "Quên mật khẩu",
      html: `<h4>Mã OTP để đặt lại mật khẩu là "${user.resetOTP}"</h4>`,
    }),
    user.save(),
  ]);

  res.json({
    success: true,
    message: "Kiểm tra email để hoàn thành quá trình reset password",
  });
});

// ========== reset password ========== //

const resetPassword = asyncMiddleware(async (req, res, next) => {
  const { resetOTP, password, confirmPassword } = req.body;

  const user = await User.findOne({
    resetOTP,
    resetOTPExpiration: { $gt: Date.now() },
  });
  if (!user) {
    throw ErrorResponse(400, "Mã otp vừa nhập đã hết hạn hoặc không hợp lệ");
  }

  if (password !== confirmPassword) {
    throw new ErrorResponse(400, "Mật khẩu xác nhận không khớp");
  }

  const salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(password, salt);

  user.password = hashedPassword;
  user.resetOTP = "";
  user.resetOTPExpiration = "";

  await user.save();

  res.json({
    success: true,
    message: "Đặt lại mật khẩu thành công",
  });
});

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerifyLink,
  forgotPassword,
  resetPassword,
};
