const express = require('express');
const router = express.Router();
const OrderController = require('../controller/OrderController')

router.get('/package/:id', OrderController.getPackageDetail)
router.get('/package', OrderController.getAllPackage)
router.post('/new-package', OrderController.newPackage)

module.exports = router;