const express = require("express");
const router = express.Router();
const ProductController = require("../controller/ProductController");
const upload = require("../util/multer");
const { checkToken } = require("../middleware/checkToken");

router.post("/edit", checkToken, ProductController.edit);
router.get("/all", ProductController.index);
router.post("/create", checkToken, ProductController.create);
router.get("/cart", checkToken, ProductController.getCart);
router.post("/add-product", checkToken, ProductController.addProduct);
router.post("/like", checkToken, ProductController.likeProduct);
router.get("/like", checkToken, ProductController.getLikeProduct);
router.put("/:_id", checkToken, ProductController.changeStatus);
router.get("/:_id", ProductController.detail);
router.delete("/remove-cart/:_id", checkToken, ProductController.removeProductInCart);

module.exports = router;
