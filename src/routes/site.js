const express = require('express');
const router = express.Router();
const SiteController = require('../controller/SiteController')

router.post('/login', SiteController.login)
router.post('/sigup', SiteController.sigup)
router.get('/chat', SiteController.chat)
router.get('/', SiteController.index)

module.exports = router; 