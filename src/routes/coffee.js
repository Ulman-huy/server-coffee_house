const express = require('express');
const router = express.Router();
const CoffeeController = require('../controller/CoffeeController')

router.get('/product/api', CoffeeController.index)
router.get('/coffee/:_id/edit', CoffeeController.edit)
router.put('/coffee/:_id', CoffeeController.update)
router.delete('/coffee/:_id', CoffeeController.delete)
router.get('/create', CoffeeController.create)
router.post('/store', CoffeeController.store)
router.get('/coffee', CoffeeController.product)

module.exports = router;