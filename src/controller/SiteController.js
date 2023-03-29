class SiteController {

    // [GET] /product
    index(req, res, next) {
        res.render('home');
    }
}

module.exports = new SiteController;