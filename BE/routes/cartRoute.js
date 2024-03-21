const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const cartController = require("../controllers/cartsController");
const validator = require("../middlewares/validator");
const cartSchema = require("../validations/cartSchema");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  validator(cartSchema.addToCartSchema),
  cartController.addToCart
);

router.put(
  "/:id",
  jwtAuth,
  validator(cartSchema.idSchema, "params"),
  validator(cartSchema.updateCartSchema, "body"),
  cartController.updateCart
);

router.get("/", jwtAuth, cartController.getCart);

router.delete("/delete-cart", jwtAuth, cartController.deleteCart);

router.delete(
  "/:id",
  jwtAuth,
  validator(cartSchema.idSchema, "params"),
  cartController.deleteCartProducts
);

router.get("/amount", jwtAuth, cartController.getAmountCart);

module.exports = router;
