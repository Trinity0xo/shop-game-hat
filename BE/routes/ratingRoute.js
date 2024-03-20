const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const ratingController = require("../controllers/ratingController");

const router = express.Router();

router.post("/", jwtAuth, ratingController.addRating);

module.exports = router;
