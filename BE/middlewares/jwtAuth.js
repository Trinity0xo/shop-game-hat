const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const jwtAuth = (req, res, next) => {
  const token = req.headers.authentication;

  try {
    const user = jwt.verify(token, env.JWT_SECRET);
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Lỗi đăng nhập",
    });
  }
};

module.exports = jwtAuth;
