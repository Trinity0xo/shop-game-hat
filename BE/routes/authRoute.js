const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/verify-email", authController.verifyEmail);

router.post("/resend-verify-link", authController.resendVerifyLink);

router.post("/forget-password", authController.forgotPassword);

router.put("/reset-password", authController.resetPassword);

module.exports = router;
