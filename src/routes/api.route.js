const express = require('express')
const router = express.Router()
const { recieveEmail } = require('../controllers/api.controller')
//const rateLimit = require('../middlewares/rateLimit.js')

//router.get('/auth', rateLimit, recieveEmail)

module.exports = router
