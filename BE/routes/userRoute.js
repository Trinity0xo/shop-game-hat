const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const userController = require("../controllers/userController");
const authorize = require("../middlewares/authorize");
const validator = require("../middlewares/asyncMiddleware");
const userSchema = require("../validations/userSchema");

const router = express.Router();

router.put(
  "/change-password",
  jwtAuth,
  validator(userSchema.changePasswordSchema),
  userController.changePassword
);

router.put(
  "/update-information",
  jwtAuth,
  validator(userSchema.updateUserSchema),
  userController.updateUserInformation
);

router.get("/me", jwtAuth, userController.getMe);

router.get("/", jwtAuth, authorize, userController.getAllUsers);

router.put(
  "/:id",
  jwtAuth,
  authorize,
  validator(userSchema.editUserSchema),
  userController.editUser
);

router.delete(
  "/:id",
  jwtAuth,
  authorize,
  validator(userSchema.idSchema, "params"),
  userController.deleteUser
);

router.put(
  "/admin/change-admin-password",
  jwtAuth,
  authorize,
  userController.changeAdminPassword
);

module.exports = router;
