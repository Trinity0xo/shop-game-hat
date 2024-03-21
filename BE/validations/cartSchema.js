const Joi = require("./joi");

const objectIdSchema = Joi.objectId().required();

const addToCartSchema = Joi.object({
  id: objectIdSchema,
  quantity: Joi.number().integer().required(),
});

const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().required(),
});

const idSchema = Joi.object({
  id: objectIdSchema,
});

module.exports = {
  addToCartSchema,
  updateCartSchema,
  idSchema,
  objectIdSchema,
};
