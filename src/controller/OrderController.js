const { Package } = require("../models/package");

class OrderController {
  async getAllPackage(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const packages = await Package.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      const total = await Package.countDocuments({}).exec();

      return res.status(200).json({
        data: packages,
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

  async getPackageDetailAdmin(req, res) {
    try {
      const { _id } = req.params;
      const pkg = await Package.find({ _id }).populate("cart.product_id");

      if (pkg) {
        return res.status(200).json(pkg);
      }
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Không tìm thấy đơn hàng!" });
    }
  }

  async getAllPackageByUserId(req, res) {
    try {
      const user = req.user;
      const packages = await Package.find({ userId: user._id }).populate(
        "cart.product_id"
      );

      return res.status(200).json(packages);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
  }
  // [POST] /new-package
  newPackage(req, res) {
    try {
      const newPackage = new Package({ ...req.body });
      const user = req.user;
      if (newPackage) {
        user.cart = [];
        user.save();
        newPackage.save();
        return res.status(201).json({ message: "OK" });
      }
      return res.status(500).json({ message: "error" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error" });
    }
  }
  async getPackageDetail(req, res) {
    try {
      const user = req.user;
      const { _id } = req.params;
      const pkg = await Package.find({ _id, userId: user._id }).populate(
        "cart.product_id"
      );

      if (pkg) {
        return res.status(200).json(pkg);
      }
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Không tìm thấy đơn hàng!" });
    }
  }
}

module.exports = new OrderController();
