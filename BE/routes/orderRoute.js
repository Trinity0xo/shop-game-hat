const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const authorize = require("../middlewares/authorize");
const orderController = require("../controllers/ordersController");
const validator = require("../middlewares/validator");
const orderSchema = require("../validations/orderSchema");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  validator(orderSchema.createOrderSchema),
  orderController.createOrder
);

router.post("/MoMo", jwtAuth, orderController.createOrderWithMoMo);

router.get("/", jwtAuth, orderController.getOrders);

router.put(
  "/:id",
  jwtAuth,
  validator(orderSchema.idSchema, "params"),
  orderController.cancelOrderUser
);

router.get("/all-orders", jwtAuth, authorize, orderController.getAllOrders);

router.put(
  "/admin/confirm/:id",
  jwtAuth,
  authorize,
  validator(orderSchema.idSchema, "params"),
  orderController.confirmOrder
);

router.put(
  "/admin/delivery/:id",
  jwtAuth,
  authorize,
  validator(orderSchema.idSchema, "params"),
  orderController.deliveryOrder
);

router.put(
  "/admin/cancel/:id",
  jwtAuth,
  authorize,
  validator(orderSchema.idSchema, "params"),
  orderController.cancelOrderAdmin
);

module.exports = router;
