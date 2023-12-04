require("dotenv").config();
const { Product } = require("../models/product");

class ProductController {
  // [GET] all
  async index(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        brand,
        name,
        star,
        min,
        max,
      } = req.query;

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
      if (star) {
        query.star = star;
      }
      if (min !== undefined) {
        query.price = { $gte: parseFloat(min) };
      }
      
      if (max !== undefined) {
        query.price = { ...query.price, $lte: parseFloat(max) };
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
  async detail(req, res) {
    try {
      const { _id } = req.params;
      const product = await Product.findById({ _id });
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
      }
      return res.status(200).json({ data: product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "error" });
    }
  }
}

module.exports = new ProductController();
