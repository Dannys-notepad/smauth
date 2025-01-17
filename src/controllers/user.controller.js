const { validationResult } = require('express-validator')
const { User } = require('../models/user.model')
const pixmail = require('pixmail')
pixmail.setup({
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  })
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
  
  
  const emailHtml = pixmail.generateTemplate('withButton', {
    recipientName: data.email,
    topic: 'Your Account Verification',
    action: 'This is your account verification email',
    linkUrl: `${req.protocol}://${req.hostname}/auth?uuid=${data.uuid}`,
    yourName: 'smauth'
  })
  
  
  
  try {
    let user
    const Users = new User()
    user = await Users.getUserByEmail(data.email)
    if (!user) {
      user = await Users.createUser(data)
      try {
        const sent = await pixmail.sendMail({
          from: process.env.SMTP_USER,
          to: data.email,
          subject: 'Account Verification',
          bodyType: 'html',
          body: emailHtml
        })
  
        if(sent){
          return res.redirect('/mailsent')
        }
      } catch (e) {
        console.log(e.toString())
        return res.status(500).json({nsg: 'An error occurred, try again later'})
      }
      return res.redirect('/login')
    }
    return res.redirect('/login')
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'An error occurred , try again later'});
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
      //console.log(user)
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
      const emailHtml = pixmail.generateTemplate('withButton', {
        recipientName: user.email,
        topic: 'Your Account Verification',
        action: 'This is your account verification email',
        linkUrl: `${req.protocol}://${req.hostname}/auth?uuid=${user.uuid}`,
        yourName: 'smauth'
      })
      const sent = await pixmail.sendMail({
          from: process.env.SMTP_USER,
          to: data.email,
          subject: 'Account Verification',
          bodyType: 'html',
          body: emailHtml
        })
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
