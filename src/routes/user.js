const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const { checkToken } = require("../middleware/checkToken");

router.get("/me", checkToken, UserController.getMe);
router.get("/admin/users", checkToken, UserController.getAllUser);
router.get("/getPackage", checkToken, UserController.getPackage);
router.post("/update-info", checkToken, UserController.updateUser);
router.post("/change-password", UserController.changePassword);
router.post("/forgot-password", UserController.forgotPassword);

module.exports = router;
