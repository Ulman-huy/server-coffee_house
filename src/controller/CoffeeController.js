const Coffee = require('../models');
const { multipleMongooseToObject, mongooseToObject } = require('../util/mongoose')

class CoffeeController {

    // [GET] api
    index(req, res, next) {
        Coffee.find({})
            .then(coffee => res.json(coffee))
    }
    // [GET] /product
    product(req, res, next) {
        Coffee.find({})
            .then(coffee => res.render('product', { coffee: multipleMongooseToObject(coffee) }))
    }
    // [GET] /product/create
    create(req, res, next) {
        res.render('create')
    }
    // [POST] /product/store
    store(req, res, next) {
        const coffee = new Coffee( req.body )
        coffee.save()
            .then(() => res.redirect('/product/create'))
            .catch(next)
    }
    // [GET] /product/coffee/:id/edit
    edit(req, res, next) {
        Coffee.findOne({_id: req.params._id})
            .then(coffee => res.render('edit', { coffee: mongooseToObject(coffee) }))
            .catch(next)
    }
    // [PUT] /product/coffee/:id/update
    update(req, res, next) {
        Coffee.updateOne({_id: req.params._id}, req.body )
            .then(() => res.redirect('/product/'))
    }
    // [DELETE] /product/coffee/:id/delete
    delete(req, res, next) {
        Coffee.deleteOne({_id: req.params._id})
            .then(() => res.redirect('back'))
    }
}

module.exports = new CoffeeController;