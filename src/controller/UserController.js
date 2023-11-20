const { Package } = require("../models/package");
const { Product } = require("../models/product");
const { Image } = require("../models/image");
const { User } = require("../models/user");
const { randomToken } = require("../util");
const { sendEmailForgotPassword } = require("../util/mailer");
const jwt = require("jsonwebtoken");
const { cryptPassword } = require("../util/hashPassword");

const serverUrl = process.env.SERVER;

class UserController {
  // [POST] /user/getCart
  getCart(req, res, next) {
    const { user } = req.body;
    User.findOneAndUpdate({ _id: user._id }, user)
      .then(() => console.log("Cập nhật giỏ hàng thành công!"))
      .catch((err) => console.log(err));

    let id_products = [];
    user.cart.map((cart) => id_products.push(cart.id_product));
    Product.find({ _id: { $in: id_products } })
      .populate("images")
      .exec()
      .then((products) => {
        const result = products.map((product) => {
          const imageIds = product.images;
          const images = [];
          return Promise.all(
            imageIds.map(async (imageId) => {
              return Image.findById(imageId).then((image) => {
                if (image) {
                  images.push(image);
                }
              });
            })
          ).then(() => {
            return {
              _id: product._id,
              type: product.type,
              name: product.name,
              brand: product.brand,
              price: product.price,
              star: product.star,
              sale: product.sale,
              description: product.description,
              info: product.info,
              src: images.map((image) => serverUrl + image.path.slice(11)),
              slug: product.slug,
            };
          });
        });
        return Promise.all(result);
      })
      .then((result) => {
        res.status(200).json(result);
      });
  }
  // [PUT] /user/upadte-location
  updataLocation(req, res, next) {
    User.findOneAndUpdate({ _id: req.body.userId }, req.body).then((user) =>
      console.log("Cập nhật thông tin thành công!")
    );

    User.findById(req.body.userId).then((user) => res.status(200).json(user));
  }
  // [GET] /user/package
  getPackage(req, res, next) {
    Package.find({ userId: req.query.id })
      .then((pkgs) => {
        const pkgInfoList = pkgs.map((pkg) => pkg.toObject());
        const id_products = pkgInfoList.reduce((ids, pkg) => {
          pkg.cart.forEach((item) => ids.push(item.id_product));
          return ids;
        }, []);
        return Product.find({ _id: { $in: id_products } })
          .populate("images")
          .exec()
          .then((products) => {
            const result = products.map(async (product) => {
              const imageIds = product.images;
              const images = [];
              for (let i = 0; i < imageIds.length; i++) {
                const image = await Image.findById(imageIds[i]);
                if (image) {
                  images.push(image);
                }
              }
              const pkg = pkgInfoList.find((pkg) => {
                return pkg.cart.some(
                  (item) =>
                    item.id_product.toString() === product._id.toString()
                );
              });
              const qnt = pkg.cart.find(
                (item) => item.id_product === product.id
              ).quantity;
              return {
                _id: product._id,
                type: product.type,
                name: product.name,
                brand: product.brand,
                quantity: qnt,
                price: product.price,
                sale: product.sale,
                src: images.map((image) => serverUrl + image.path.slice(11)),
              };
            });
            return Promise.all(result).then((pkgProducts) => {
              return (pkgs = pkgInfoList.map((pkg) => {
                const pkgResult = pkgProducts.filter((product) => {
                  return pkg.cart.some(
                    (item) =>
                      item.id_product.toString() === product._id.toString()
                  );
                });
                console.log(pkgResult);
                return {
                  id: pkg._id,
                  name: pkg.name,
                  phone: pkg.phone,
                  status: pkg.status,
                  time: pkg.time,
                  location: pkg.location,
                  message: pkg.message,
                  packages: [...pkgResult],
                  cart: pkg.cart,
                };
              }));
            });
          });
      })
      .then((result) => res.status(200).json(result))
      .catch(next);
  }
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
}

module.exports = new UserController();
