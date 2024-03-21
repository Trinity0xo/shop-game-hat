const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const ratingController = require("../controllers/ratingController");
const validator = require("../middlewares/validator");
const ratingSchema = require("../validations/ratingSchema");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  validator(ratingSchema.addRatingSchema),
  ratingController.addRating
);

module.exports = router;
