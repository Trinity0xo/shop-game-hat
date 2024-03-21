const Joi = require("./joi");
const { objectIdSchema } = require("../validations/cartSchema");

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  manufacturer: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
  img: Joi.string().required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string(),
  manufacturer: Joi.string(),
  type: Joi.string(),
  description: Joi.string(),
  price: Joi.string(),
  img: Joi.required(),
});

const idSchema = Joi.object({
  id: objectIdSchema,
});

const searchProductSchema = Joi.object({
  name: Joi.string(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  searchProductSchema,
  idSchema,
};
