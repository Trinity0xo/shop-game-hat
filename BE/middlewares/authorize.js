const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Không được phép",
    });
  }

  next();
};

module.exports = isAdmin;
