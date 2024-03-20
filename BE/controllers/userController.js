const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../response/ErrorResponse");

// ========== change password ========== //

const changePassword = asyncMiddleware(async (req, res, next) => {
  const { password, newPassword, confirmPassword } = req.body;
  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy tài khoản");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw ErrorResponse(401, "Mật khẩu không hợp lệ");
  }

  if (newPassword !== confirmPassword) {
    throw ErrorResponse(400, "Mật khẩu xác thực không khớp");
  }

  const salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);

  await User.findByIdAndUpdate(userId, { password: hashedPassword });

  res.json({
    success: true,
    message: "Cập nhật mật khẩu thành công",
  });
});

// ========== update user information ========== //

const updateUserInformation = asyncMiddleware(async (req, res, next) => {
  const { phone, address } = req.body;
  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy tài khoản");
  }

  await User.findByIdAndUpdate(userId, { phone, address }, { new: true });

  res.json({
    success: true,
    message: "Cập nhật thành công",
  });
});

// ========== get me ========== //

const getMe = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId).select(
    "-password -isAdmin -isVerified -_id -resetOTP -resetOTPExpiration -registerTokenExpiration -registerToken"
  );
  if (!user) {
    throw ErrorResponse(404, "Không tìm thấy tài khoản");
  }

  res.json({
    success: true,
    data: user,
  });
});

// ========== get all users ========== //

const getAllUsers = asyncMiddleware(async (req, res, next) => {
  const { id: userId } = req.user;

  const users = await User.find({ _id: { $ne: userId }, isAdmin: false });

  res.json({
    success: true,
    data: users,
  });
});

// ========== edit user ========== //

const editUser = asyncMiddleware(async (req, res, next) => {
  const { name, phone, address } = req.body;
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { name, phone, address },
    { new: true }
  );

  res.json({
    success: true,
    message: "Cập nhật thông tin user thành công",
    data: user,
  });
});

// ========== delete user ========== //

const deleteUser = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Xóa user thành công",
  });
});

// ========== change admin password ========== //

const changeAdminPassword = asyncMiddleware(async (req, res, next) => {
  const { password, newPassword, confirmPassword } = req.body;
  const { id: userId } = req.user;

  const user = await User.findById(userId);

  if (!bcrypt.compareSync(password, user.password)) {
    throw ErrorResponse(401, "Mật khẩu không hợp lệ");
  }

  if (newPassword !== confirmPassword) {
    throw ErrorResponse(400, "Mật khẩu xác thực không khớp");
  }

  const salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);

  await User.findByIdAndUpdate(userId, { password: hashedPassword });

  res.json({
    success: true,
    message: "Cập nhật mật khẩu cho admin thành công",
  });
});

module.exports = {
  changePassword,
  updateUserInformation,
  getMe,
  getAllUsers,
  editUser,
  deleteUser,
  changeAdminPassword,
};

// // // get user when is admin
// // exports.getUserWhenAdmin = async (req, res) => {
// // try {
// //     const token = req.headers.authentication;
// //     if (!token) {
// //       return res.status(401).json({
// //         success: false,
// //         message: "Không được phép",
// //       });
// //     }
// //     const key = process.env.JWT_SEC;
// //     const decoded = jwt.verify(token, key);
// //     const user = await User.findOne({ email: decoded.email });
// //     if (!user.isAdmin) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Bạn không có quyền",
// //       });
// //     }
// //     const userFound = await User.findById(req.params.id);
// //     if (!userFound) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Không tìm thấy người dùng",
// //       });
// //     }
// //     return res.status(200).json({
// //       success: true,
// //       data: userFound,
// //     });
// // } catch (err) {
// //     console.log(err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Đã xảy ra sự cố khi xuất thông tin chi tiết người dùng",
// //     });
// // }
// // };
