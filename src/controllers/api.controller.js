
const uid = require('../utils/uniqueId')
const { authMail } = require('../models/api.model')

const recieveEmail = (req, res, next) => {
    if(!req.query.emailaddress){
    return res.status(400).json({message:'email address must be added in query'})
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  if(!emailRegex.test(req.query.emailaddress)){
    return res.status(400).json({message: 'this email address is invalid'})
  }
  
  let data = {
    ip: req.ip,
    timestamp: Date.now(),
    uid: uid(),
    email: req.query.emailaddress,
    //otp: generateOtp(),
    res
  }
  
  const Auth = new authMail(data)
  
  let action = Auth.sendMail()
  res.send(action)
  
  
}

module.exports = {
  recieveEmail,
}
