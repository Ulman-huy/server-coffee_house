require("dotenv").config();
const { Product } = require("../models/product");

const serverUrl = process.env.SERVER;
class ProductController {
  // [GET] all
  async index(req, res) {
    try {
      const { page = 1, limit = 10, type, brand, name } = req.query;

      const query = { status: { $ne: "DELETED" } };
      if (type) {
        query.type = type;
      }
      if (brand) {
        query.brand = brand;
      }
      if (name) {
        query.name = { $regex: new RegExp(name, "i") };
      }

      const products = await Product.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      const total = await Product.countDocuments(query).exec();

      return res.status(200).json({
        data: products,
        limit,
        page,
        total,
        totalPage: Math.ceil(total / limit),
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("error");
    }
  }

  // [GET] /product/create
  async create(req, res, next) {
    try {
      const user = req.user;
      if (user.role != "ADMIN") {
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

  // [POST] /product/edit
  async edit(req, res, next) {
    try {
      const user = req.user;
      if (user.role != "ADMIN") {
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

  // [PUT] /product/:id
  async changeStatus(req, res) {
    try {
      const user = req.user;
      if (user.role != "ADMIN") {
        return res.status(500).json({
          message: "Tài khoản không được cấp phép cho chức năng này!",
        });
      }
      const { status } = req.body;
      const { _id } = req.params;
      const product = await Product.findById({ _id });
      product.status = status;
      product.save();
      return res.status(201).json({ message: "OK" });
    } catch (err) {
      console.log(err);
      return res.status(500).json("error");
    }
  }

  // [GET] /product
  product(req, res, next) {}

  // [POST] /product/store
  store(req, res, next) {}
  // [GET] /product/product/api/:id
  getProduct(req, res, next) {}

  // [GET] /product/search?q
  search(req, res, next) {}
}

module.exports = new ProductController();
