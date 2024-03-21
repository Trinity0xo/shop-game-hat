const Cart = require("../models/Cart");
const User = require("../models/User");
const Order = require("../models/Order");
const SalesReport = require("../models/SalesReport");
const Rating = require("../models/Rating");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../response/ErrorResponse");

// ========== create order ========== //

const createOrder = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;
  const { name, phone, city, district, wards, streetAndHouseNumber } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "không tìm thấy người dùng");
  }

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    throw ErrorResponse(404, "không tìm thấy giỏ hàng");
  }

  const newOrder = new Order({
    userId: user._id,
    products: cart.products,
    total: cart.total,
    name: name || user.name,
    phone: phone || user.phone,
    city: city || user.city,
    district: district || user.district,
    wards: wards || user.wards,
    streetAndHouseNumber: streetAndHouseNumber || user.streetAndHouseNumber,
    address: `${streetAndHouseNumber}, ${wards}, ${district}, ${city}`,
    methods: "COD (thanh toán khi giao hàng)",
    status: "Đang chờ",
  });

  for (const product of newOrder.products) {
    const productRating = await Rating.findOne({ productId: product.id });
    let userRating = 0;
    if (productRating) {
      const userRatingObj = productRating.users.find(
        (ratingObj) => ratingObj.id.toString() === user._id.toString()
      );
      if (userRatingObj) {
        userRating = userRatingObj.rating;
      }
    }
    product.rating = userRating;
  }

  for (const product of newOrder.products) {
    product.rating = 0;
  }

  await newOrder.save();

  await cart.deleteOne({ userId: user._id });

  res.json({
    success: true,
    message: "Đặt hàng thành công",
  });
});

// ========== create order with MoMo ========== //

const createOrderWithMoMo = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;
  const { name, phone, city, district, wards, streetAndHouseNumber, address } =
    req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "không tìm thấy người dùng");
  }

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    throw ErrorResponse(404, "không tìm thấy giỏ hàng");
  }

  const newOrder = new Order({
    userId: user._id,
    products: cart.products,
    total: cart.total,
    name: name || user.name,
    phone: phone || user.phone,
    city: city || user.city,
    district: district || user.district,
    wards: wards || user.wards,
    streetAndHouseNumber: streetAndHouseNumber || user.streetAndHouseNumber,
    methods: "Thanh toán với MOMO",
    status: "Đã thanh toán",
  });

  for (const product of newOrder.products) {
    const productRating = await Rating.findOne({ productId: product.id });
    let userRating = 0;
    if (productRating) {
      const userRatingObj = productRating.users.find(
        (ratingObj) => ratingObj.id.toString() === user._id.toString()
      );
      if (userRatingObj) {
        userRating = userRatingObj.rating;
      }
    }
    product.rating = userRating;
  }

  newOrder.address =
    address ||
    `${newOrder.streetAndHouseNumber}, ${newOrder.wards}, ${newOrder.district}, ${newOrder.city}`;

  for (const product of newOrder.products) {
    product.rating = 0;
  }

  await newOrder.save();

  await cart.deleteOne({ userId: user._id });

  res.json({
    success: true,
    message: "Đặt hàng thành công",
  });
});

// ========== get user orders ========== //

const getOrders = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "không tìm thấy người dùng");
  }

  const order = await Order.find({ userId: user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    data: order,
  });
});

// ========== get all orders ========== //

const getAllOrders = asyncMiddleware(async (req, res, next) => {
  const order = await Order.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    data: order,
  });
});

// ========== confirm order ========== //

const confirmOrder = asyncMiddleware(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw ErrorResponse(404, "không tìm thấy đơn hàng");
  }

  if (order.status !== "Đang chờ" && order.status !== "Đã thanh toán") {
    throw ErrorResponse(
      400,
      "Không thể xác nhận đơn hàng khi đang ở trạng thái trên"
    );
  }

  order.status = "Xác nhận";

  await order.save();

  res.json({
    success: true,
    message: "Xác nhận đơn hàng thành công",
  });
});

// ========== delivery order ========== //

const deliveryOrder = asyncMiddleware(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw ErrorResponse(404, "không tìm thấy đơn hàng");
  }

  if (order.status !== "Xác nhận") {
    throw ErrorResponse(
      400,
      "Chỉ có thể xác nhận đã giao hàng khi đã xác nhận đơn hàng"
    );
  }

  let amount = 0;
  order.products.forEach((product) => {
    amount += product.quantity;
  });

  const today = new Date();
  const salesReportDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  let salesReport = await SalesReport.findOne({ date: salesReportDate });
  if (!salesReport) {
    salesReport = new SalesReport({
      date: salesReportDate,
      totalSales: order.total,
      numberOfOrders: 1,
      totalUsers: 1,
      totalProducts: amount,
    });
  } else {
    salesReport.totalSales += order.total;
    salesReport.numberOfOrders++;
    const existingOrder = await Order.findOne({
      userId: order.userId,
      createdAt: { $gte: salesReportDate },
      status: "Đã giao",
    });
    if (!existingOrder) {
      salesReport.totalUsers++;
    }

    salesReport.totalProducts += amount;
  }

  await salesReport.save();

  order.status = "Đã giao";

  await order.save();

  res.json({
    success: true,
    message: "Xác nhận đã giao hàng thành công",
  });
});

// ========== cancel order ========== //

const cancelOrderUser = asyncMiddleware(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw ErrorResponse(404, "không tìm thấy đơn hàng");
  }

  if (order.status !== "Đang chờ" && order.status !== "Đã thanh toán") {
    throw ErrorResponse(
      400,
      "Chỉ có thể hủy đơn hàng khi đơn hàng đang đợi xác nhận"
    );
  }

  order.status = "Đã hủy";

  await order.save();

  res.json({
    success: true,
    message: "Hủy đơn hàng thành công",
  });
});

// ========== cancel order when admin ========== //

const cancelOrderAdmin = asyncMiddleware(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw ErrorResponse(404, "không tìm thấy đơn hàng");
  }

  if (order.status == "Đã giao") {
    throw ErrorResponse(400, "Không thể hủy đơn hàng khi đã giao hàng");
  }

  order.status = "Đã hủy";

  await order.save();

  res.json({
    success: true,
    message: "Hủy đơn hàng thành công",
  });
});

module.exports = {
  createOrder,
  createOrderWithMoMo,
  getOrders,
  getAllOrders,
  confirmOrder,
  deliveryOrder,
  cancelOrderUser,
  cancelOrderAdmin,
};
