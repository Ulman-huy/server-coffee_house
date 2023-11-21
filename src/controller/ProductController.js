require("dotenv").config();
const { Product } = require("../models/product");
const { Image } = require("../models/image");
const {
  multipleMongooseToObject,
  mongooseToObject,
} = require("../util/mongoose");

const serverUrl = process.env.SERVER;
class ProductController {
  // [GET] all
  index(req, res, next) {
    Product.find()
      .populate("images")
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
        res.json(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  }
  // [GET] /product
  product(req, res, next) {
    Product.find({}).then((product) =>
      res.render("product", { product: multipleMongooseToObject(product) })
    );
  }
  // [GET] /product/create
  create(req, res, next) {
    res.render("create", {
      success: req.flash("success"),
      error: req.flash("error"),
    });
  }
  // [POST] /product/store
  store(req, res, next) {
    const files = req.files;
    const images = [];
    const id_images = [];

    // Tạo mảng các Promise
    const promises = files.map((file) => {
      const image = new Image({
        filename: file.originalname,
        path: file.path,
        size: file.size,
      });
      images.push(image);
      return image.save().then((image) => image._id);
    });

    // Đợi tất cả các Promise hoàn tất
    Promise.all(promises)
      .then((ids) => {
        id_images.push(...ids);
        const product = new Product({ ...req.body, images: id_images });
        return product.save();
      })
      .then(() => {
        // Send a success message to the client
        req.flash("success", "Lưu sản phẩm thành công!");
        res.redirect("/product/create");
      })
      .catch(next);
  }
  // [GET] /product/product/:id/edit
  edit(req, res, next) {
    Product.findOne({ _id: req.params._id })
      .then((product) =>
        res.render("edit", { product: mongooseToObject(product) })
      )
      .catch(next);
  }
  // [PUT] /product/product/:id/update
  update(req, res, next) {
    Product.updateOne({ _id: req.params._id }, req.body).then(() =>
      res.redirect("/product/")
    );
  }
  // [DELETE] /product/product/:id/delete
  delete(req, res, next) {
    Product.deleteOne({ _id: req.params._id }).then(() => res.redirect("back"));
  }
  // [GET] /product/product/api/:id
  getProduct(req, res, next) {
    Product.findOne({ slug: req.params.slug })
      .populate("images")
      .then((product) => {
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
          const result = {
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
          res.json(result);
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }

  // [GET] /product/search?q
  search(req, res, next) {
    const searchTerm = req.query.q;
    const regex = new RegExp(searchTerm, "i");
    Product.find({ name: regex })
      .populate("images")
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
        res.json(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  }
  getByCategory(req, res, next) {
    Product.find({ type: req.body.type })
      .populate("images")
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
        res.json(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  }
  getByBrand(req, res, next) {
    Product.find({ brand: req.body.brand })
      .populate("images")
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
        res.json(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  }
  getByStar(req, res, next) {
    Product.find({ star: req.body.star })
      .populate("images")
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
        res.json(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  }
  getByPrice(req, res, next) {
    const minPrice = req.body.minValue;
    const maxPrice = req.body.maxValue;
    Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
      .populate("images")
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
        res.json(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  }
}

module.exports = new ProductController();
