const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const authorize = require("../middlewares/authorize");
const CommentController = require("../controllers/commentController");

const router = express.Router();

router.post("/", jwtAuth, CommentController.addComment);

router.get("/:id", CommentController.getComments);

router.delete("/:id", jwtAuth, CommentController.deleteComment);

module.exports = router;
