const ObjectId = require('mongoose').Types.ObjectId;
const { Package, Product, Image } = require('../models')
const { multipleMongooseToObject, mongooseToObject } = require('../util/mongoose')
const serverUrl = process.env.SERVER;

class OrderController {
    getAllPackage(req, res, next) {
        Package.find({})
            .then(packages => res.render('package', { packages: multipleMongooseToObject(packages) }))
        
    }
    // [POST] /user/new-package
    newPackage(req, res, next) {
        const newPackage = new Package({
            ...req.body,
            _id: new ObjectId(),
            userId: req.body._id
        })
        newPackage.save()
            .then(() => res.status(200).json({ message: 'Đặt đơn hàng thành công!'}))
            .catch(err => res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau!'}))
    }
    getPackageDetail(req, res, next) {
        let id_products = []
        let pkgInfo = {} 
        let qnt;

        Package.findById({ _id: req.params.id })
            .then(pkg => {
                pkgInfo = pkg
                pkg.cart.map(product => id_products.push(product.id_product))
                return id_products
            })
            .then((id_products) => {
                Product.find({_id: {$in: id_products}})
                    .populate('images')
                    .exec()
                    .then((products) => {
                        const result = products.map(product => {
                        const imageIds = product.images;
                        const images = [];
                        return Promise.all(imageIds.map((imageId) => {
                            return Image.findById(imageId)
                            .then((image) => {
                                if (image) {
                                    images.push(image);
                                }
                            });
                        })).then(() => {
                            const newCart = Object.values(pkgInfo.cart)
                            newCart.forEach(item => {
                                if(item.id_product === product.id) {
                                    qnt = item.quantity
                                }
                            });
                            return {
                                _id: product._id,
                                type: product.type,
                                name: product.name,
                                brand: product.brand,
                                quantity: qnt,
                                price: product.price,
                                sale: product.sale,
                                src: images.map(image => serverUrl + image.path.slice(11)),
                            };
                        });
                        });
                        return Promise.all(result);
                    })
                    .then((result) => {
                        const pkg = {
                            id: pkgInfo._id,
                            name: pkgInfo.name,
                            phone: pkgInfo.phone,
                            status: pkgInfo.status,
                            time: pkgInfo.time,
                            location: pkgInfo.location,
                            message: pkgInfo.message,
                            packages: [...result],
                            cart: pkgInfo.cart,
                        }
                        res.render('package-detail', { package: pkg})
                    })
            })
    }
}

module.exports = new OrderController;