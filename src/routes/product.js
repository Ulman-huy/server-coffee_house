const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController')

router.get('/api', ProductController.index)
router.get('/api/:slug', ProductController.getProduct)
router.get('/:_id/edit', ProductController.edit)
router.put('/:_id', ProductController.update)
router.delete('/:_id', ProductController.delete)
router.get('/create', ProductController.create)
router.post('/store', ProductController.store)
router.get('/', ProductController.product)

module.exports = router;