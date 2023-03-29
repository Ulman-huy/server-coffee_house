const express = require('express');
const router = express.Router();
const SiteController = require('../controller/SiteController')

router.get('/', SiteController.index)

module.exports = router;