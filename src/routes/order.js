const express = require("express");
const router = express.Router();
const OrderController = require("../controller/OrderController");
const { checkToken } = require("../middleware/checkToken");

router.get("/package/:id", OrderController.getPackageDetail);
router.get("/package", checkToken, OrderController.getAllPackageByUserId);
router.post("/new-package", checkToken, OrderController.newPackage);

module.exports = router;
