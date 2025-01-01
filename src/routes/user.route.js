const express = require('express')
const router = express.Router()
const { processSignup, oauth } = require('../controllers/user.controller')
const { renderSignup, renderLogin, signupFail, emailSent, error500, authfail } = require('../controllers/render.controller')
const { check } = require('express-validator')

router.get('/signup', renderSignup)
router.get('/signupfail', signupFail)
router.get('/mailsent', emailSent)
router.get('/error500', error500)
router.get('/authfail', authfail)
router.get('/api/v1/auth/confirm', oauth)
router.get('/login', renderLogin)

router.post('/signup', [
  check('name').isLength({min: 3, max: 20}),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({min: 8, max: 20})
], processSignup) 


//router.post('/dasboard', dasboard)



module.exports = router 