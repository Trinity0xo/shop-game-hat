const Joi = require("./joi");

const pwSchema = Joi.string().min(6).required();
const emailSchema = Joi.string().email().required();

const registerSchema = Joi.object({
  name: Joi.string().min(6).max(60).required(),
  email: emailSchema,
  password: pwSchema,
});

const loginSchema = Joi.object({
  email: emailSchema,
  password: pwSchema,
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().min(23).required(),
});

const resendVerifyEmailSchema = Joi.object({
  email: emailSchema,
});

const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

const resetPasswordSchema = Joi.object({
  resetOTP: Joi.string().min(6).max(6).required(),
  password: pwSchema,
  confirmPassword: pwSchema,
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  pwSchema,
};
