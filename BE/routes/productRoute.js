const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const productController = require("../controllers/productsController");
const authorize = require("../middlewares/authorize");
const validator = require("../middlewares/validator");
const productSchema = require("../validations/productSchema");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  authorize,
  validator(productSchema.createProductSchema),
  productController.createProduct
);

router.get(
  "/top-sale-products",
  jwtAuth,
  authorize,
  productController.getTopSalesProducts
);

router.put(
  "/:id",
  jwtAuth,
  authorize,
  validator(productSchema.idSchema, "params"),
  validator(productSchema.updateProductSchema, "body"),
  productController.updateProduct
);

router.delete(
  "/:id",
  jwtAuth,
  authorize,
  validator(productSchema.idSchema, "params"),
  productController.deleteProduct
);

router.get(
  "/:id",
  validator(productSchema.idSchema, "params"),
  productController.getProduct
);

router.get("/", productController.getAllProducts);

router.post(
  "/search/result",
  validator(productSchema.searchProductSchema),
  productController.searchProducts
);

module.exports = router;
