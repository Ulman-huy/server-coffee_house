const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");

router.post("/login", AuthController.login);
router.post("/sigup", AuthController.sigup);
router.get("/verify/:token", AuthController.verify);

module.exports = router;
