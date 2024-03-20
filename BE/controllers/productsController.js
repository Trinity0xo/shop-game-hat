const Product = require("../models/Product");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../response/ErrorResponse");
const Rating = require("../models/Rating");
const Order = require("../models/Order");

// ========== create product ========== //

const createProduct = asyncMiddleware(async (req, res, next) => {
  const { name, manufacturer, type, description, price, img } = req.body;

  await Product.create({ name, manufacturer, type, description, price, img });

  res.status(201).json({
    success: true,
    message: "Tạo sản phẩm thành công",
  });
});

// ========== update product ========== //

const updateProduct = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { name, manufacturer, type, description, price, img } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw ErrorResponse(404, "Không tìm thấy sản phẩm");
  }

  await product.updateOne({
    name,
    manufacturer,
    type,
    description,
    price,
    img,
  });

  res.json({
    success: true,
    message: "Cập nhật sản phẩm thành công",
  });
});

// ========== delete product ========== //

const deleteProduct = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;

  await Product.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Xoá sản phẩm thành công",
  });
});

// ========== get product ========== //

const getProduct = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw ErrorResponse(404, "Không tìm thấy sản phẩm");
  }

  const rating = await Rating.findOne({ productId: id });
  const avgRating = rating ? rating.avgRating : 0;
  const totalRating = rating ? rating.totalRating : 0;

  const productWithRating = {
    ...product.toJSON(),
    avgRating,
    totalRating,
  };

  res.json({
    success: true,
    data: productWithRating,
  });
});

// ========== get all products ========== //

const getAllProducts = asyncMiddleware(async (req, res, next) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const startIndex = (page - 1) * limit;
  const type = req.headers.type ? decodeURIComponent(req.headers.type) : null;
  const sortBy = req.query.sortBy || "createdAt:desc";
  const [sortField, sortOrder] = sortBy.split(":");
  const sortObj = { [sortField]: sortOrder === "desc" ? -1 : 1 };
  const query = {};

  if (type) query.type = new RegExp("^" + type + "$", "i");

  const lengthAllProduct = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sortObj)
    .skip(startIndex)
    .limit(limit);

  res.json({
    success: true,
    data: products,
    length: lengthAllProduct,
  });
});

// ========== search product ========== //

const searchProducts = asyncMiddleware(async (req, res, next) => {
  const query = {};
  const { name } = req.body;

  if (name) {
    query.name = new RegExp(name, "i");
  }

  const lengthAllProduct = await Product.countDocuments(query);
  const products = await Product.find(query);

  res.json({
    success: true,
    data: products,
    length: lengthAllProduct,
  });
});

// ========== get top sale product ========== //

const getTopSalesProducts = asyncMiddleware(async (req, res, next) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const orders = await Order.find({
    createdAt: {
      $gte: new Date(year, month - 1, 1),
      $lte: new Date(year, month, 0, 23, 59, 59, 999),
    },
  });

  const products = {};

  orders.forEach((order) => {
    order.products.forEach((product) => {
      if (order.status === "Đã giao")
        if (products[product.id]) {
          products[product.id].quantity += product.quantity;
        } else {
          products[product.id] = {
            name: product.name,
            manufacturer: product.manufacturer,
            type: product.type,
            img: product.img,
            price: product.price,
            quantity: product.quantity,
          };
        }
    });
  });

  const topProducts = Object.values(products)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  res.json({
    success: true,
    data: topProducts,
  });
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  searchProducts,
  getTopSalesProducts,
};
