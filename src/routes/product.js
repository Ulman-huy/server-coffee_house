const express = require("express");
const router = express.Router();
const ProductController = require("../controller/ProductController");
const upload = require("../util/multer");
const { checkToken } = require("../middleware/checkToken");

router.get("/search", ProductController.search);
router.post("/store", upload.array("images"), ProductController.store);

router.post("/edit", checkToken, ProductController.edit);
router.get("/all", checkToken, ProductController.index);
router.post("/create", checkToken, ProductController.create);
router.delete("/:_id", checkToken, ProductController.changeStatus);

router.get("/", ProductController.product);

module.exports = router;
