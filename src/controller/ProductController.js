const Product = require('../models');
const { multipleMongooseToObject, mongooseToObject } = require('../util/mongoose')

class ProductController {

    // [GET] api
    index(req, res, next) {
        Product.find({})
            .then(product => res.json(product))
    }
    // [GET] /product
    product(req, res, next) {
        Product.find({})
            .then(product => res.render('product', { product: multipleMongooseToObject(product) }))
    }
    // [GET] /product/create
    create(req, res, next) {
        res.render('create')
    }
    // [POST] /product/store
    store(req, res, next) {
        const product = new Product( req.body )
        product.save()
            .then(() => res.redirect('/product/create'))
            .then(() => res.send('123'))
            .catch(next)
    }
    // [GET] /product/product/:id/edit
    edit(req, res, next) {
        Product.findOne({_id: req.params._id})
            .then(product => res.render('edit', { product: mongooseToObject(product) }))
            .catch(next)
    }
    // [PUT] /product/product/:id/update
    update(req, res, next) {
        Product.updateOne({_id: req.params._id}, req.body )
            .then(() => res.redirect('/product/'))
    }
    // [DELETE] /product/product/:id/delete
    delete(req, res, next) {
        Product.deleteOne({_id: req.params._id})
            .then(() => res.redirect('back'))
    }
    getProduct(req, res, next) {
        Product.findOne( {slug: req.params.slug})
            .then(prd => res.json(prd))
    }
}

module.exports = new ProductController;