const express = require('express')
const router = express.Router()
const { processSignup, oauth, processLogin } = require('../controllers/user.controller')
const { renderSignup, renderLogin, signupFail, emailSent, error500, authfail, doesNotExist, wrongPass, notVerified, dashboard } = require('../controllers/render.controller')
const { check } = require('express-validator')

router.get('/signup', renderSignup)
router.get('/signupfail', signupFail)
router.get('/mailsent', emailSent)
router.get('/error500', error500)
router.get('/authfailed', authfail)
router.get('/auth', oauth)
router.get('/login', renderLogin)
router.get('/usernotfound', doesNotExist)
router.get('/wrongpassword', wrongPass)
router.get('/notverified', notVerified)
router.get('/dashboard', dashboard)

router.post('/signup', [
  check('name').isLength({min: 3, max: 20}),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({min: 8, max: 20})
], processSignup) 

router.post('/login', processLogin)



//router.post('/dasboard', dasboard)



module.exports = router 