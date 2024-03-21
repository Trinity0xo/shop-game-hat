const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../response/ErrorResponse");
const User = require("../models/User");

// ========== add to cart ========== //

const addToCart = asyncMiddleware(async (req, res, next) => {
  const { id, quantity } = req.body;
  const { id: userId } = req.user;

  const product = await Product.findById(id);
  if (!product) {
    throw ErrorResponse(404, "Không tìm thấy sản phẩm");
  }

  const cart = await Cart.findOne({ userId: userId });
  if (!cart) {
    await Cart.create({
      userId: userId,
      products: {
        id: product.id,
        name: product.name,
        img: product.img,
        type: product.type,
        price: product.price,
        quantity: quantity,
      },
      total: product.price * quantity,
    });
  } else {
    const matchingProduct = cart.products.findIndex(
      (product) => product.id == id
    );
    if (matchingProduct !== -1) {
      const updatedProduct = [...cart.products];
      updatedProduct[matchingProduct].quantity += quantity;
      await Cart.findOneAndUpdate(
        { userId: userId },
        {
          products: updatedProduct,
          total: cart.total + product.price * quantity,
        }
      );
    } else {
      const newProduct = {
        id: product.id,
        name: product.name,
        img: product.img,
        type: product.type,
        price: product.price,
        quantity: quantity,
      };
      const updatedProduct = [...cart.products, newProduct];
      await Cart.findOneAndUpdate(
        { userId: userId },
        {
          products: updatedProduct,
          total: cart.total + product.price * quantity,
        }
      );
    }
  }

  res.json({
    success: true,
    message: "Thành công",
  });
});

// ========== update cart ========== //

const updateCart = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: productId } = req.params;
  const { quantity } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy người dùng");
  }

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    throw ErrorResponse(404, "Không tìm thấy giỏ hàng");
  }

  const product = cart.products.find(
    (product) => String(product.id) === productId
  );

  const productIndex = cart.products.findIndex(
    (product) => String(product.id) === productId
  );
  if (productIndex < 0) {
    throw ErrorResponse(404, "Không tìm thấy sản phẩm trong giỏ hàng");
  }

  const updatedProducts = [...cart.products];
  const oldQuantity = updatedProducts[productIndex].quantity;
  updatedProducts[productIndex].quantity = quantity;
  const newTotal =
    cart.total - oldQuantity * product.price + quantity * product.price;

  const updatedCart = await Cart.findByIdAndUpdate(
    { _id: cart.id },
    { products: updatedProducts, total: newTotal },
    { new: true }
  );

  res.json({
    success: true,
    message: "Thành công",
    data: updatedCart,
  });
});

// ========== delete cart product ========== //

const deleteCartProducts = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: productId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy người dùng");
  }

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    throw ErrorResponse(404, "Không tìm thấy giỏ hàng");
  }
  //   if (!cart) {
  //     return res.status(200).json({
  //       success: true,
  //       data: null,
  //     });
  //   }

  const products = cart.products.filter((val) => val.id !== productId);
  const deletedProduct = cart.products.find((val) => val.id === productId);
  const deletedQuantity = deletedProduct.price * deletedProduct.quantity;
  const newTotal = cart.total - deletedQuantity;

  if (products.length === 0) {
    await Cart.findOneAndDelete({ userId: user._id });

    return res.json({
      success: true,
      message: "Xóa giỏ hàng thành công",
    });
  }

  await Cart.findOneAndUpdate(
    { userId: user._id },
    { products, total: newTotal }
  );

  res.json({
    success: true,
    message: "Xóa sản phẩm trong giỏ thành công",
  });
});

// ========== delete cart ========== //

const deleteCart = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy người dùng");
  }

  await Cart.findOneAndDelete({ userId: user._id });

  res.json({
    success: true,
    message: "Thành công",
    data: null,
  });
});

// ========== get cart ========== //

const getCart = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy người dùng");
  }

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    return res.json({
      success: true,
      data: null,
    });
  }

  res.json({
    success: true,
    data: cart,
  });
});

// ========== get amount cart ========== //

const getAmountCart = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy người dùng");
  }

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    return res.json({
      success: true,
      data: null,
    });
  }

  let amount = 0;
  cart.products.forEach((products) => {
    amount += products.quantity;
  });

  res.json({
    success: true,
    data: amount,
  });
});

module.exports = {
  addToCart,
  updateCart,
  deleteCartProducts,
  deleteCart,
  getCart,
  getAmountCart,
};
