const express = require('express');
const router = express.Router()
const coffeeRouter = require('./coffee');
const siteRouter = require('./site');

const route = app => {
    app.use('/product', coffeeRouter)

    app.use('/', siteRouter)
}

module.exports = route;