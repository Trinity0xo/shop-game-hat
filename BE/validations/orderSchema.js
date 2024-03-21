const Joi = require("./joi");
const { objectIdSchema } = require("../validations/cartSchema");

const createOrderSchema = Joi.object({
  name: Joi.string().min(6).max(60).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(10).required(),
  city: Joi.string().required(),
  district: Joi.string().required(),
  wards: Joi.string().required(),
  streetAndHouseNumber: Joi.string().required(),
});

const idSchema = Joi.object({
  id: objectIdSchema,
});

module.exports = {
  createOrderSchema,
  idSchema,
};
