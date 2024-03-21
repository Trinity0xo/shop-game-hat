const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const CommentController = require("../controllers/commentController");
const validator = require("../middlewares/validator");
const commentSchema = require("../validations/commentSchema");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  validator(commentSchema.addCommentSchema),
  CommentController.addComment
);

router.get(
  "/:id",
  validator(commentSchema.idSchema, "params"),
  CommentController.getComments
);

router.delete(
  "/:id",
  jwtAuth,
  validator(commentSchema.idSchema, "params"),
  CommentController.deleteComment
);

module.exports = router;
