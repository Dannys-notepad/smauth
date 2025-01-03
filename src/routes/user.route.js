const express = require('express')
const router = express.Router()
const { processSignup, oauth, processLogin } = require('../controllers/user.controller')
const { renderSignup, renderLogin, signupFail, emailSent, error500, authfail, doesNotExist, wrongPass, notVerified } = require('../controllers/render.controller')
const { check } = require('express-validator')

router.get('/signup', renderSignup)
router.get('/signupfail', signupFail)
router.get('/mailsent', emailSent)
router.get('/error500', error500)
router.get('/authfail', authfail)
router.get('/api/v1/auth/confirm', oauth)
router.get('/login', renderLogin)
router.get('/usernotfound', doesNotExist)
router.get('/wrongpassword', wrongPass)
router.get('/notverified', notVerified)

router.post('/signup', [
  check('name').isLength({min: 3, max: 20}),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({min: 8, max: 20})
], processSignup) 

router.post('/login', processLogin)



//router.post('/dasboard', dasboard)



module.exports = router 