const express = require("express");
const router = express.Router();
const OrderController = require("../controller/OrderController");
const { checkToken } = require("../middleware/checkToken");

router.get("/package", checkToken, OrderController.getAllPackageByUserId);
router.get("/package/:_id", checkToken, OrderController.getPackageDetail);
router.post("/new-package", checkToken, OrderController.newPackage);

module.exports = router;
