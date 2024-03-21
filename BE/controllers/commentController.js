const User = require("../models/User");
const Product = require("../models/Product");
const Comment = require("../models/Comment");
const Order = require("../models/Order");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../response/ErrorResponse");

// ========== add comment ========== //

const addComment = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;
  const { productId, parentCommentId, comment } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy người dùng");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw ErrorResponse(404, "Không tìm thấy sản phẩm");
  }

  const orders = await Order.find({ userId: user.id });
  if (!orders) {
    throw ErrorResponse(404, "Không tìm thấy đơn hàng");
  }

  let newParentCommentId = null;
  let repliedToUsername = null;
  if (parentCommentId !== undefined) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw ErrorResponse(404, "Không tìm thấy bình luận");
    }

    if (parentComment.parentCommentId === null) {
      newParentCommentId = parentComment._id;
    } else {
      newParentCommentId = parentComment.parentCommentId;
    }

    if (parentComment.userId.toString() !== user.id.toString()) {
      repliedToUsername = parentComment.name;
    }
  }

  const isProductInOrder = orders.some((order) =>
    order.products.some(
      (product) => product.id.toString() === productId.toString()
    )
  );

  const newComment = new Comment({
    productId,
    userId: user.id,
    name: user.name,
    email: user.email,
    comment,
    parentCommentId: newParentCommentId,
    repliedToUsername: repliedToUsername,
    isAdmin: user.isAdmin,
    purchased: isProductInOrder,
  });

  await newComment.save();

  res.json({
    success: true,
    message: "Thêm bình luận thành công",
    data: newComment,
  });
});

// ========== delete comment ========== //

const deleteComment = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy người dùng");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw ErrorResponse(404, "Không tìm thấy bình luận");
  }

  await Comment.findByIdAndDelete(commentId);

  res.json({
    success: true,
    message: "Xóa bình luận thành công",
  });
});

// ========== get comments ========== //

const getComments = asyncMiddleware(async (req, res, next) => {
  const { id: productId } = req.params;

  const comments = await Comment.find({
    productId,
    parentCommentId: null,
  }).sort({ createdAt: -1 });

  const commentsWithReplies = [];

  for (const comment of comments) {
    const commentData = comment.toObject();

    const replies = await Comment.find({ parentCommentId: comment._id }).sort({
      createdAt: 1,
    });

    commentData.replies = [];

    for (const reply of replies) {
      const replyData = reply.toObject();
      commentData.replies.push(replyData);
    }

    commentsWithReplies.push(commentData);
  }

  res.json({
    success: true,
    comments: commentsWithReplies,
    total: comments.length,
  });
});

module.exports = {
  addComment,
  deleteComment,
  getComments,
};
