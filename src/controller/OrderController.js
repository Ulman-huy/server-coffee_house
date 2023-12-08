const ObjectId = require("mongoose").Types.ObjectId;
const { Package } = require("../models/package");
const { Product } = require("../models/product");
const { multipleMongooseToObject } = require("../util/mongoose");
const serverUrl = process.env.SERVER;

class OrderController {
  getAllPackage(req, res) {}

  async getAllPackageByUserId(req, res) {
    try {
      const user = req.user;
      const packages = await Package.find({ userId: user._id });
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
  getPackageDetail(req, res, next) {}
}

module.exports = new OrderController();
