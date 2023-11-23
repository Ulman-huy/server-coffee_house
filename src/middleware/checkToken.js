const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { getTokenHeader } = require("../util");

const checkToken = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    if (!token) {
      return res
        .status(500)
        .json({ message: "Vui lòng đăng nhập vào hệ thống!" });
    }
    const tokenSplit = getTokenHeader(req.header("authorization"));
    const { _id } = jwt.verify(tokenSplit, process.env.SECRET_KEY);
    const user = await User.findById({ _id }).select("-password");
    if (!user) {
      return res.status(500).json({ message: "Tài khoản không tồn tại!" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Token invalid!", error);
  }
};

module.exports = { checkToken };
