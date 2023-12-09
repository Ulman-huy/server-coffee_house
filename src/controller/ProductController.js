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
      const product = await Product.findByIdAndUpdate({ _id }, { ...req.body });
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
  async addProduct(req, res) {
    try {
      const user = req.user;
      const { _id, type, quantity } = req.body;

      if (type === "PLUS") {
        const productExist = user.cart.find(
          (item) => item.product_id.toString() === _id
        );
        if (productExist) {
          const newCart = user.cart.map((item) => {
            if (item.product_id.toString() === _id) {
              return {
                ...item,
                quantity: (item.quantity += quantity),
              };
            }
            return item;
          });
          user.cart = newCart;
        } else {
          user.cart.push({ product_id: _id, quantity: quantity });
        }
        user.save();
        return res.status(200).json({ message: "OK" });
      }
      if (type === "MINUS") {
        const productExist = user.cart.find(
          (item) => item.product_id.toString() === _id
        );

        if (productExist) {
          const newCart = user.cart
            .map((item) => {
              if (item.product_id.toString() === _id) {
                return {
                  ...item,
                  quantity: (item.quantity -= quantity),
                };
              }
              return item;
            })
            .filter((item) => item.quantity > 0);
          user.cart = newCart;
          user.save();
          return res.status(200).json({ message: "OK" });
        } else {
          return res
            .status(400)
            .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
        }
      }
    } catch (error) {
      console.log(err);
      return res.status(500).json({ message: "error" });
    }
  }
  async getCart(req, res) {
    try {
      const user = req.user;

      const productPromises = user.cart.map(async (element) => {
        const product = await Product.findById({ _id: element.product_id })
          .select("-description -info")
          .exec();
        if (!product) {
          return product;
        }
        const productWithQuantity = {
          ...product.toObject(),
          quantity: element.quantity,
        };
        return productWithQuantity;
      });

      const products = await Promise.all(productPromises);
      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
  }

  async likeProduct(req, res) {
    try {
      const user = req.user;
      const { _id, type } = req.body;

      if (type == "LIKE") {
        user.like.push(_id);
      }
      if (type == "DISLIKE") {
        user.like.filter((item) => item.toString() != _id);
      }
      user.save();
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
  }

  async removeProductInCart(req, res) {
    try {
      const user = req.user;
      const { _id } = req.params;

      const newCart = user.cart.filter(
        (item) => item.product_id.toString() != _id
      );
      user.cart = newCart;
      user.save();
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
  }
  async getLikeProduct(req, res) {
    try {
      const user = req.user;
      const productPromises = user.like.map(async (element) => {
        return await Product.findById({ _id: element }).exec();
      });
      const products = await Promise.all(productPromises);
      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
  }
}

module.exports = new ProductController();
