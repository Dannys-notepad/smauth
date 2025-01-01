const uuid = require('uuid')

const { validationResult } = require('express-validator')
const { User } = require('../models/user.model')
const mailer = require('../services/mailer')
const generateUid = require('../utils/uniqueId')


const processSignup = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.redirect('/signupfail')
  }
  
  let { name, email, password} = await req.body
  let verificationToken = uuid.v4()
  let data =  {
    name,
    email,
    password: btoa(password),
    verificationToken,
    acct_verified: 'false'
  }
  
  try {
    let user
    const Users = new User()
    user = await Users.getUserByEmail(data.email)
    if (!user) {
      let mail = await mailer(data.verificationToken, data.email)
      
      if(mail.toString() === 'Error: getaddrinfo ENOTFOUND smtp.gmail.com' || mail.toString() === 'Error: Client network socket disconnected before secure TLS connection was established'){
        return res.redirect('/error500?from=signup')
      }
      console.log(mail)
      user = await Users.createUser(data)
      return res.redirect('/mailsent')
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

module.exports = {
  processSignup,
  oauth
}
