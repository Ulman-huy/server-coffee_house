const ObjectId = require("mongoose").Types.ObjectId;
const { Package } = require("../models/package");
const { Product } = require("../models/product");
const { multipleMongooseToObject } = require("../util/mongoose");
const serverUrl = process.env.SERVER;

class OrderController {
  getAllPackage(req, res, next) {
   
  }
  // [POST] /user/new-package
  newPackage(req, res, next) {
    
  }
  getPackageDetail(req, res, next) {
   
  }
}

module.exports = new OrderController();
