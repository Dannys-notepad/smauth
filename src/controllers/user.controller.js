const { validationResult } = require('express-validator')
const { User } = require('../models/user.model')
const mailer = require('../services/mailer')
const generate = require('../utils/generate')


const processSignup = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.redirect('/signupfail')
  }
  
  let { name, email, password} = await req.body
  let uuid = generate.uuid()
  let data =  {
    name,
    email,
    password: btoa(password),
    uuid,
    acct_verified: 'false'
  }
  
  try {
    let user
    const Users = new User()
    user = await Users.getUserByEmail(data.email)
    if (!user) {
      user = await Users.createUser(data)
      return res.redirect('/mailsent')
      //return res.redirect('/error500?from=signup')
    }
    return res.redirect('/login')
  } catch (err) {
    console.error(err);
    //return res.status(500).json({ message: err });
  }
}

const oauth = async (req, res, next) => {
  let uuid = await req.query.uuid
  try {
    let user
    const Users = new User()
    user = await User.getUserByUuid(uuid)
    if(user){
      return res.redirect('/login')
    }
    return res.redirect('/authfailed')
  } catch (e) {
    console.error(e)
    return res.redirect('/error500?from=login')
  }
}

const processLogin = async  (req, res, next) => {
  let { email, password } = await req.body
  
  try {
    let user 
    const Users = new User()
    user = await Users.getUserByEmail(email)
    if(!user){
      return res.redirect('/usernotfound')
    }
    if(atob(user.password) !== password){
      return res.redirect('/wrongpassword')
    }
    if(user.acct_verified === 'false'){
      return res.redirect('/notverified')
    }
  } catch (e) {
    return res.status(500).json({message: 'error fetching user'})
  }
}

module.exports = {
  processSignup,
  oauth,
  processLogin
}
