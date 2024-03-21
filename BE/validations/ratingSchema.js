const Joi = require("./joi");
const { objectIdSchema } = require("../validations/cartSchema");

const addRatingSchema = Joi.object({
  productId: objectIdSchema,
  orderId: objectIdSchema,
  rating: Joi.number().min(1).max(5).required(),
});

module.exports = {
  addRatingSchema,
};
