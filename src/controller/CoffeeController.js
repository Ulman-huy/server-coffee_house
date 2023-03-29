const Coffee = require('../models');

class CoffeeController {

    // [GET] /product
    index(req, res, next) {
        Coffee.find({})
            .then(coffee => res.json(coffee))
    }
    create(req, res, next) {
        res.render('create')
    }
}

module.exports = new CoffeeController;