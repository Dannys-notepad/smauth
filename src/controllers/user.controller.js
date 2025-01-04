const { validationResult } = require('express-validator')
const { User } = require('../models/user.model')
const mailer = require('../services/mailer')
//const sendMail = require('../utils/sendMail')
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
  let smptConfig = {
    user: process.env.SMTP_USER,
    appPassword: process.env.SMTP_PASS,
    subject: 'SMAuth',
    recipientsEmail: data.email
  }
  let mailgenConfig = {
    //theme: 'default',
    projectName: 'SMAuth',
    indexLink: 'http://localhost:5000'
  }
  let mailTemplate = {
    heading: 'Authentication Mail',
    introText: 'this is your authentication mail',
    action: {
      instruction: 'click the button to verify your account',
      button:{
        //color: '',
        text: 'click me to verify',
        link: 'http://localhost:5000/api/v1/auth?confirm='+data.uuid
      }
    },
    outroText: ''
  }
  
  try {
    let user
    const Users = new User()
    user = await Users.getUserByEmail(data.email)
    if (!user) {
      user = await Users.createUser(data)
      try {
        const mail = await mailer(smptConfig, mailgenConfig, mailTemplate)
        if(mail){
          return res.redirect('/mailsent')
        }
      } catch (e) {
        console.log(e.toString())
        return res.status(500).json({e})
      }
      return res.redirect('/login')
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
