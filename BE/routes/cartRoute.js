const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const cartController = require("../controllers/cartsController");

const router = express.Router();

router.post("/", jwtAuth, cartController.addToCart);

router.put("/:id", jwtAuth, cartController.updateCart);

router.get("/", jwtAuth, cartController.getCart);

router.delete("/delete-cart", jwtAuth, cartController.deleteCart);

router.delete("/:id", jwtAuth, cartController.deleteCartProducts);

router.get("/amount", jwtAuth, cartController.getAmountCart);

module.exports = router;
