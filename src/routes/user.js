const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController')

router.post('/getCart', UserController.getCart)
router.post('/update-location', UserController.updataLocation)

module.exports = router;