const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const productController = require("../controllers/productsController");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.post("/", jwtAuth, authorize, productController.createProduct);

router.put("/:id", jwtAuth, authorize, productController.updateProduct);

router.delete("/:id", jwtAuth, authorize, productController.deleteProduct);

router.get("/:id", productController.getProduct);

router.get("/", productController.getAllProducts);

router.post("/search/result", productController.searchProducts);

module.exports = router;
