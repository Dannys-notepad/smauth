const renderSignup = (req, res, next) => {
  //console.log(`${req.protocol}://${req.hostname}${req.url}`)
  res.render('signup')
}

const signupFail = (req, res, next) => {
  res.render('signupfail')
}
const error500 = (req, res, next) => {
  let from = req.query.from
  res.render('error500', {from})
}

const emailSent = (req, res, next) => {
  res.render('emailSent')
}

const authfail = (req, res, next) => {
  res.render('uuid')
}

const renderLogin = (req, res, next) => {
  res.render('login')
}

const doesNotExist= (req, res, next) => {
  res.render('notexists')
}

const wrongPass= (req, res, next) => {
  res.render('wrongpassword')
}

const notVerified= (req, res, next) => {
  res.render('notverified')
}

const dashboard= (req, res, next) => {
  if(!req.session.user){
    return res.redirect('/login')
  }
  res.render('dashboard')
}


module.exports = {
  renderSignup,
  signupFail,
  emailSent,
  renderLogin,
  error500,
  authfail,
  doesNotExist,
  wrongPass,
  notVerified,
  dashboard
}