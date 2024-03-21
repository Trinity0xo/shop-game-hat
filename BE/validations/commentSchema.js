const Joi = require("./joi");
const { objectIdSchema } = require("../validations/cartSchema");

const addCommentSchema = Joi.object({
  productId: objectIdSchema,
  parentCommentId: Joi.objectId().optional(),
  comment: Joi.string().required(),
});

const idSchema = Joi.object({
  id: objectIdSchema,
});

module.exports = {
  addCommentSchema,
  idSchema,
};
