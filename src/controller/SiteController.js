const { User } = require('../models');

class SiteController {

    // [GET] /product
    index(req, res, next) {
        res.render('home');
    }
    // Login
    login(req,res, next) {

    }
    // Sigup
    // signup (req, res)  {
    //     const { username, password } = req.body;
    //     // Kiểm tra nếu các trường thông tin đăng ký bị thiếu
    //     if (!username || !password) {
    //         return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin đăng ký!' });
    //     }
    
    //     // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    //     // User.findOne({ username: username })
    //     //     .then((existingUser) => {
    //     //         if (existingUser) {
    //     //             throw new Error('Tài khoản đã tồn tại!');
    //     //         }
    //     //         // Tạo user mới và lưu vào cơ sở dữ liệu
    //     //         const newUser = new User({ username, password });
    //     //         return newUser.save();
    //     //     })
    //     //     .then(() => {
    //     //         return res.status(200).json({ message: 'Đăng ký thành công!' });
    //     //     })
    //     //     .catch((err) => {
    //     //         console.error(err);
    //     //         return res.status(500).json({ message: 'Đăng ký không thành công!' });
    //     // });
    // };
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
            .then(() => {
                return res.status(200).json({ message: 'Đăng ký thành công!' });
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ message: 'Đăng ký không thành công!' })
            });

    }
}

module.exports = new SiteController;