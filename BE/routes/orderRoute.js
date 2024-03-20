const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const authorize = require("../middlewares/authorize");
const orderController = require("../controllers/ordersController");

const router = express.Router();

router.post("/", jwtAuth, orderController.createOrder);

router.post("/MoMo", jwtAuth, orderController.createOrderWithMoMo);

router.get("/", jwtAuth, orderController.getOrders);

router.put("/:id", jwtAuth, orderController.cancelOrderUser);

router.get("/all-orders", jwtAuth, authorize, orderController.getAllOrders);

router.put(
  "/admin/confirm/:id",
  jwtAuth,
  authorize,
  orderController.confirmOrder
);

router.put(
  "/admin/delivery/:id",
  jwtAuth,
  authorize,
  orderController.deliveryOrder
);

router.put(
  "/admin/cancel/:id",
  jwtAuth,
  authorize,
  orderController.cancelOrderAdmin
);

module.exports = router;
