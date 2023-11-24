const express = require("express");
const router = express.Router();
// const upload = require("../util/multer");
const { checkToken } = require("../middleware/checkToken");
const SiteController = require("../controller/SiteController");
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", checkToken, upload.single("file"), SiteController.upload);

module.exports = router;
