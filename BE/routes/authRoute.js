const express = require("express");
const authController = require("../controllers/authController");
const validator = require("../middlewares/validator");
const authSchema = require("../validations/authSchema");

const router = express.Router();

router.post(
  "/register",
  validator(authSchema.registerSchema),
  authController.register
);

router.post("/login", validator(authSchema.loginSchema), authController.login);

router.get(
  "/verify-email",
  validator(authSchema.verifyEmailSchema, "query"),
  authController.verifyEmail
);

router.post(
  "/resend-verify-link",
  validator(authSchema.resendVerifyEmailSchema),
  authController.resendVerifyLink
);

router.post(
  "/forget-password",
  validator(authSchema.forgotPasswordSchema),
  authController.forgotPassword
);

router.put(
  "/reset-password",
  validator(authSchema.resetPasswordSchema),
  authController.resetPassword
);

module.exports = router;
