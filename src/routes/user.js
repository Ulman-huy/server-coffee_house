const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const { checkToken } = require("../middleware/checkToken");

router.post("/getCart", checkToken, UserController.getCart);
router.get("/me", checkToken, UserController.getMe);
router.get("/getPackage", checkToken, UserController.getPackage);
router.post("/update-location", checkToken, UserController.updataLocation);
router.post("/change-password", UserController.changePassword);
router.post("/forgot-password", UserController.forgotPassword);

module.exports = router;
