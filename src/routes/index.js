const express = require('express');

const productRouter = require('./product');
const siteRouter = require('./site');
const userRouter = require('./user');

const route = app => {
    app.use('/product', productRouter)
    app.use('/user', userRouter)

    app.use('/', siteRouter)
}

module.exports = route;