const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController')
const upload = require('../util/multer');

router.get('/all' ,ProductController.index)
router.get('/search' ,ProductController.search)
router.post('/getByCategory' ,ProductController.getByCategory)
router.post('/getByPrice' ,ProductController.getByPrice)
router.post('/getByStar' ,ProductController.getByStar)
router.post('/getByBrand' ,ProductController.getByBrand)
router.get('/api/:slug', ProductController.getProduct)
router.get('/:_id/edit', ProductController.edit)
router.put('/:_id', ProductController.update)
router.delete('/:_id', ProductController.delete)
router.get('/create', ProductController.create)
router.post('/store', upload.array('images'), ProductController.store)
router.get('/', ProductController.product)

module.exports = router;