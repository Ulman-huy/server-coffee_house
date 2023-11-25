const express = require("express");
const router = express.Router();
const ProductController = require("../controller/ProductController");
const upload = require("../util/multer");
const { checkToken } = require("../middleware/checkToken");

router.get("/all", ProductController.index);
router.get("/search", ProductController.search);
router.post("/getByCategory", ProductController.getByCategory);
router.post("/getByPrice", ProductController.getByPrice);
router.post("/getByStar", ProductController.getByStar);
router.post("/getByBrand", ProductController.getByBrand);
router.get("/api/:slug", ProductController.getProduct);
router.post("/edit", checkToken, ProductController.edit);
router.delete("/:_id", ProductController.delete);
router.post("/create", checkToken, ProductController.create);
router.post("/store", upload.array("images"), ProductController.store);
router.get("/", ProductController.product);

module.exports = router;
