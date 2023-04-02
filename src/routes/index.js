const express = require('express');

const productRouter = require('./product');
const siteRouter = require('./site');

const route = app => {
    app.use('/product', productRouter)

    app.use('/', siteRouter)
}

module.exports = route;