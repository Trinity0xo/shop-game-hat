const Joi = require("./joi");
const { objectIdSchema } = require("./cartSchema");
const { pwSchema } = require("./authSchema");

const changePasswordSchema = Joi.object({
  password: pwSchema,
  newPassword: pwSchema,
  confirmPassword: pwSchema,
});

const updateUserSchema = Joi.object({
  phone: Joi.string().min(10).max(10).required(),
  address: Joi.string().required(),
});

const editUserSchema = Joi.object({
  name: Joi.string().min(6).max(60).required(),
  phone: Joi.string().min(10).max(10).required(),
  address: Joi.string().required(),
});

const idSchema = Joi.object({
  id: objectIdSchema,
});

// const changeAdminPasswordSchema = Joi.object({
//   // password: pwSchema,
//   // newPassword: pwSchema,
//   // confirmPassword: pwSchema,
// });

module.exports = {
  changePasswordSchema,
  // changeAdminPasswordSchema,
  updateUserSchema,
  editUserSchema,
  idSchema,
};
