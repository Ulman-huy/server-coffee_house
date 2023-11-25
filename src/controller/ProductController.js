require("dotenv").config();
const { Product } = require("../models/product");

const serverUrl = process.env.SERVER;
class ProductController {
  // [GET] all
  index(req, res, next) {}

  // [GET] /product/create
  async create(req, res, next) {
    try {
      const user = req.user;
      if (user.rules != "ADMIN") {
        return res.status(500).json({
          message: "Tài khoản không được cấp phép cho chức năng này!",
        });
      }
      const { name, price } = req.body;
      if (!name || !price) {
        return res.status(500).json({
          message: "Vui lòng nhập đầy đủ thông tin!",
        });
      }
      const product = new Product({ ...req.body });
      product.save();
      return res.status(201).json({ message: "OK" });
    } catch (err) {
      console.log(err);
      return res.status(500).json("error");
    }
  }

  // [GET] /product/edit
  async edit(req, res, next) {
    try {
      const user = req.user;
      if (user.rules != "ADMIN") {
        return res.status(500).json({
          message: "Tài khoản không được cấp phép cho chức năng này!",
        });
      }
      const { _id, name, price } = req.body;
      if (!name || !price) {
        return res.status(500).json({
          message: "Vui lòng nhập đầy đủ thông tin!",
        });
      }
      const product = await Product.findByIdAndUpdate({ _id }, { ...res.body });
      product.save();
      return res.status(201).json({ message: "OK" });
    } catch (err) {
      console.log(err);
      return res.status(500).json("error");
    }
  }

  // [DELETE] /product/product/:id/delete
  async delete(req, res, next) {
    try {
      const user = req.user;
      if (user.rules != "ADMIN") {
        return res.status(500).json({
          message: "Tài khoản không được cấp phép cho chức năng này!",
        });
      }
      const { _id } = req.body;
      const product = await Product.findById({ _id });
      product.status = "DELETED";
      product.save();
      return res.status(201).json({ message: "OK" });
    } catch (err) {
      console.log(err);
      return res.status(500).json("error");
    }
  }

  // [GET] /product
  product(req, res, next) {
    
  }

  // [POST] /product/store
  store(req, res, next) {}
  // [GET] /product/product/api/:id
  getProduct(req, res, next) {}

  // [GET] /product/search?q
  search(req, res, next) {}
  getByCategory(req, res, next) {}
  getByBrand(req, res, next) {}
  getByStar(req, res, next) {}
  getByPrice(req, res, next) {}
}

module.exports = new ProductController();
