const { validationResult } = require('express-validator')
const { User } = require('../models/user.model')
const mailer = require('../services/mailer')
const sendMail = require('../utils/sendMail')
const pixmail = require('pixmail')
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
    acct_verified: 'false',
    time_stamp_created: Date.now()
  }
  
  let configData = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    recipientEmail: data.email,
    subject: 'Account verification email',
    bodyType: 'html',
    body: `
    <h3>Hello There, please verify your account</h3>
    <p><a href="http://localhost:5000/auth?uuid=${data.uuid}"><b>verify account</b></a></p>
    `
  }
  
  try {
    let user
    const Users = new User()
    user = await Users.getUserByEmail(data.email)
    if (!user) {
      user = await Users.createUser(data)
      try {
        //const mail = await mailer(smptConfig, mailgenConfig, mailTemplate)
        const mail = await pixmail(configData)
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
    console.error(err)
    return res.status(500).json({ message: err });
  }
}

const oauth = async (req, res, next) => {
  let uuid = await req.query.uuid
  try {
    let user
    const Users = new User()
    user = await Users.getUserByUuid(uuid)
    if(user){
      if(user.acct_verified === 'true'){
        return res.redirect('/login')
      }
      user.acct_verified = 'true'
      user.uuid = 'null'
      let data = {
        Id: user.Id,
        verified: user.acct_verified,
        uuid: user.uuid
      }
      const update = await Users.updateUser1(data)
      console.log(user)
      return res.redirect('/login')
    } else {
      return res.redirect('/authfailed')
    }
    
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
    if(user.acct_verified !== 'true'){
      const sent = await sendMail(email, user.uuid)
      if(sent){
        return res.redirect('/notverified')
      }
      return res.redirect('/error500?from=login')
    }
    if(atob(user.password) !== password){
      return res.redirect('/wrongpassword')
    }
    req.session.user = {
      user: user.email
    }
    return res.redirect('/dashboard')
  } catch (e) {
    return res.status(500).json({message: 'error fetching user'})
  }
}

module.exports = {
  processSignup,
  oauth,
  processLogin
}
