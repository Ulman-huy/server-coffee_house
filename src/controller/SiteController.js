const { User, Product, Image } = require('../models');
const serverUrl = process.env.SERVER;
class SiteController {

    // [GET] /product
    index(req, res, next) {
        res.render('home');
    }
    // [POST]/login
    login(req,res, next) {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!"})
        }
        User.findOne({ username: username })
            .then((user) => {
                if(user.password === password) {
                    return res.status(200).json(user);
                }
                return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu chưa chính xác!'})
            })
            .catch((error) => {
                return res.status(400).json({ message: "Đăng nhập không thành công. Thử lại!" })
            })
    }
    // [POST]/sigup
    sigup(req, res, next) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin đăng ký!' });
        }

        User.findOne({ username: username })
            .then(existingUser => {
                if (existingUser) {
                    return res.status(200).json({ message: 'Tài khoản đã tồn tại!'})
                }
                const newUser = new User({ username, password });
                return newUser.save();
            })
            .then(user => {
                return res.status(200).json(user)
            })
            .then(() => {
                return res.status(200).json({ message: 'Đăng ký thành công!' });
            })
            .catch(err => {
                return res.status(500).json({ message: 'Đăng ký không thành công!' })
            });

    }
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
}

module.exports = new SiteController;