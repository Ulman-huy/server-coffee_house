const express = require('express');
const router = express.Router();
const CoffeeController = require('../controller/CoffeeController')

router.get('/create', CoffeeController.create)
router.get('/', CoffeeController.index)

module.exports = router;