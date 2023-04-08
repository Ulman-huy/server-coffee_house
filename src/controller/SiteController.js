const { User } = require('../models');

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
}

module.exports = new SiteController;