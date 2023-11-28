const express = require("express");
const router = express.Router();
const ProductController = require("../controller/ProductController");
const upload = require("../util/multer");
const { checkToken } = require("../middleware/checkToken");

router.post("/edit", checkToken, ProductController.edit);
router.get("/all", ProductController.index);
router.post("/create", checkToken, ProductController.create);
router.put("/:_id", checkToken, ProductController.changeStatus);
router.get("/:_id", ProductController.detail);

module.exports = router;
