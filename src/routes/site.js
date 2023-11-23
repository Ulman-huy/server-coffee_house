const express = require("express");
const router = express.Router();
const upload = require("../util/multer");
const { checkToken } = require("../middleware/checkToken");
const SiteController = require("../controller/SiteController");

router.post("/upload", checkToken, SiteController.upload);

module.exports = router;
