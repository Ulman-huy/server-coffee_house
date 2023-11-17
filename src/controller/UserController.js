const { Package } = require("../models/package");
const { Product } = require("../models/product");
const { Image } = require("../models/image");
const { User } = require("../models/user");

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
            imageIds.map((imageId) => {
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
}

module.exports = new UserController();
