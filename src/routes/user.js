const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController')

router.post('/getCart', UserController.getCart)
router.get('/getPackage', UserController.getPackage)
router.post('/update-location', UserController.updataLocation)

module.exports = router;