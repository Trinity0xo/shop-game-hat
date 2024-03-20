const User = require("../models/User");
const Product = require("../models/Product");
const Rating = require("../models/Rating");
const Order = require("../models/Order");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../response/ErrorResponse");

// ========== add rating ========== //

const addRating = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: productId, orderId, rating } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy người dùng");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw ErrorResponse(404, "Không tìm thấy sản phẩm");
  }

  const order = await Order.findOne({
    _id: orderId,
    userId: user._id,
    "products.id": productId,
  }).sort({ createdAt: -1 });
  if (!order) {
    throw ErrorResponse(400, "Chỉ có thể đánh giá sản phẩm đã đặt");
  }

  if (order.status !== "Đã giao") {
    throw ErrorResponse(
      400,
      "Chỉ có thể đánh giá sản phẩm đã xác nhận giao hàng"
    );
  }

  if (rating < 1 || rating > 5) {
    throw ErrorResponse(400, "Đánh giá phải từ 1 đến 5");
  }

  let existingRating = await Rating.findOne({
    productId: productId,
  });
  if (!existingRating) {
    existingRating = new Rating({
      productId,
      users: [],
      avgRating: 0,
      totalRating: 0,
    });
  }

  const userRating = {
    id: user._id,
    name: user.name,
    email: user.email,
    rating: rating,
  };
  existingRating.users.push(userRating);

  const sumOfRatings = existingRating.users.reduce(
    (acc, cur) => acc + cur.rating,
    0
  );

  const totalRating = existingRating.users.length;
  const roundedAvgRating = Math.round((sumOfRatings / totalRating) * 2) / 2;
  existingRating.avgRating = roundedAvgRating;
  existingRating.totalRating = totalRating;

  await existingRating.save();

  await Order.updateOne(
    { _id: orderId, "products.id": productId },
    { $set: { "products.$.rating": rating } }
  );

  res.json({
    success: true,
    message: "Đánh giá sản phẩm thành công",
    data: existingRating,
  });
});

module.exports = { addRating };
