const { User, Product, Image } = require('../models');
const serverUrl = process.env.SERVER;

class UserController {
    // [POST] /user/getCart 
    getCart(req, res, next) {
        const { user } = req.body;
        User.findOneAndUpdate({ _id: user._id}, user)
            .then(() => console.log('Cập nhật giỏ hàng thành công!'))
            .catch(err => console.log(err))

        
        let id_products = []
        user.cart.map(cart => id_products.push(cart.id_product));
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
                    return {
                        _id: product._id,
                        type: product.type,
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        star: product.star,
                        sale: product.sale,
                        description: product.description,
                        info: product.info,
                        src: images.map(image => serverUrl + image.path.slice(11)),
                        slug: product.slug,
                    };
                });
                });
                return Promise.all(result);
            })
            .then((result) => {
                res.status(200).json(result);
            })
    }
    // [PUT] /user/upadte-location
    updataLocation(req, res, next) {
        User.findOneAndUpdate({ _id: req.body.userId}, req.body)
            .then(user => console.log("Cập nhật thông tin thành công!"))
            .catch(err => console.log(err))

        User.findById(req.body.userId)
            .then(user => res.status(200).json(user)) 
    }
}

module.exports = new UserController;