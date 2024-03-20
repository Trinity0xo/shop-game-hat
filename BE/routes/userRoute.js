const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const userController = require("../controllers/userController");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.put("/change-password", jwtAuth, userController.changePassword);

router.put(
  "/update-information",
  jwtAuth,
  userController.updateUserInformation
);

router.get("/me", jwtAuth, userController.getMe);

router.get("/", jwtAuth, authorize, userController.getAllUsers);

router.put("/:id", jwtAuth, authorize, userController.editUser);

router.delete("/:id", jwtAuth, authorize, userController.deleteUser);

router.put(
  "/admin/change-admin-password",
  jwtAuth,
  authorize,
  userController.changeAdminPassword
);

module.exports = router;
