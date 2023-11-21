const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const { cryptPassword, comparePassword } = require("../util/hashPassword");
const { sendVerificationEmail } = require("../util/mailer");
const { randomToken } = require("../util");

class AuthController {
  // [GET] /product
  index(req, res, next) {
    res.render("home");
  }
  // [POST]/login
  async login(req, res) {
    try {
      const { password, email } = req.body;
      if (!password || !email) {
        return res.status(401).json({ message: "Vui lòng nhập đủ thông tin!" });
      }
      const user = await User.findOne({ email });
      if (!user || !user.verify) {
        return res.status(404).json({ message: "Tài khoản không tồn tại!" });
      }
      comparePassword(password, user.password, (err, isPasswordMatch) => {
        if (isPasswordMatch) {
          const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
          return res.status(200).json({ accessToken: token });
        } else {
          return res
            .status(404)
            .json({ message: "Tài khoản hoặc mật khẩu không chính xác!" });
        }
      });
    } catch (error) {
      return res.status(500).json("error");
    }
  }
  // [POST]/sigup
  async sigup(req, res) {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin đăng ký!" });
    }

    await User.findOne({ email })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(403).json({ message: "Tài khoản đã tồn tại!" });
        }
        cryptPassword(password, async (err, bcryptPassword) => {
          const user = new User({
            email,
            username,
            password: bcryptPassword,
            verifyToken: randomToken(),
          });

          await user.save();
          sendVerificationEmail(email, user.verifyToken, user._id);
          return res.status(200).json({
            message: "Vui lòng kiểm tra mail, để xác thực tài khoản!",
          });
        });
      })
      .catch((error) => {
        return res.status(500).json("error");
      });
  }
  async verify(req, res) {
    try {
      const token = req.params.token;
      const _id = req.query._id;

      const user = await User.findById({ _id });
      if (!user) {
        return res.render("verify", {
          layout: "verifyLayout.hbs",
          status: "NOT_FOUND",
          not_found: true,
        });
      }

      if (user.verify) {
        return res.render("verify", {
          layout: "verifyLayout.hbs",
          status: "VERIFIED",
          verified: true,
        });
      }
      if (user.verifyToken !== token) {
        return res.render("verify", {
          layout: "verifyLayout.hbs",
          status: "ERROR",
          error: true,
        });
      } else {
        user.verifyToken = undefined;
        user.verify = true;
        const accessToken = jwt.sign({ _id: user._id }, SECRET_KEY);
        user.save();
        return res.render("verify", {
          layout: "verifyLayout.hbs",
          status: "SUCCESS",
          token: accessToken,
          url: process.env.CLIENT,
          success: true,
        });
      }
    } catch (error) {
      return res.status(500).json("error");
    }
  }
  async registerSocials(req, res) {
    try {
      const { email, username, avatar, verify } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const newUser = new User({ email, username, avatar, verify: verify });
        newUser.save();
        const token = jwt.sign({ _id: newUser._id }, SECRET_KEY);
        return res.status(200).json({ accessToken: token });
      }
      if (!user.avatar) {
        user.avatar = avatar;
        await user.save();
      }
      const token = jwt.sign({ _id: user._id }, SECRET_KEY);
      return res.status(200).json({ accessToken: token });
    } catch (error) {
      return res.status(500).json({ message: "error" });
    }
  }
}

module.exports = new AuthController();
