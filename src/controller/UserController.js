const { Package } = require("../models/package");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const { randomToken } = require("../util");
const { sendEmailForgotPassword } = require("../util/mailer");
const jwt = require("jsonwebtoken");
const { cryptPassword } = require("../util/hashPassword");

const serverUrl = process.env.SERVER;

class UserController {
  // [PUT] /user/upadte-info
  updateUser(req, res) {
    try {
      const user = req.user;
      const { location, avatar, phone, username } = req.body;
      if (location) {
        user.location = location;
      }
      if (avatar) {
        user.avatar = avatar;
      }

      if (phone) {
        user.phone = phone;
      }
      if (username) {
        user.username = username;
      }
      user.save();

      return res.status(200).json({ message: "OK", data: user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
  }
  // [GET] /user/package
  getPackage(req, res, next) {}
  async getMe(req, res) {
    return res.status(201).json(req.user);
  }
  async changePassword(req, res) {
    try {
      const { password, token, _id } = req.body;
      const user = await User.findById({ _id });
      if (!user || user.forgotToken != token) {
        return res.status(500).json({
          message: "Sai địa chỉ liên kết. Vui lòng kiểm tra lại email!",
        });
      }
      cryptPassword(password, async (err, bcryptPassword) => {
        user.password = bcryptPassword;
        user.forgotToken = undefined;
        await user.save();
      });

      const jwtToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
      return res.status(201).json({ message: "OK", accessToken: jwtToken });
    } catch (err) {
      return res.status(500).json({ message: "error" });
    }
  }
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Không tìm thấy email: " + email });
      }

      user.forgotToken = randomToken();
      user.save();

      sendEmailForgotPassword(user.email, user.forgotToken, user._id);
      return res.status(201).json({ message: "OK" });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ message: "error" });
    }
  }
  async getAllUser(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const users = await User.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      const total = await User.countDocuments({}).exec();

      return res.status(200).json({
        data: users,
        limit,
        page,
        total,
        totalPage: Math.ceil(total / limit),
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
  }
}

module.exports = new UserController();
