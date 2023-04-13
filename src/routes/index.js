const productRouter = require('./product');
const siteRouter = require('./site');
const userRouter = require('./user');
const orderRouter = require('./order');
const route = app => {
    app.use('/product', productRouter)
    app.use('/user', userRouter)
    app.use('/order', orderRouter)

    app.use('/', siteRouter)
}

module.exports = route;