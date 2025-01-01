const mysql = require('mysql')
const mailer = require('../services/mailer')
const save = require('../utils/writeData')
const DB = require('../data/data.json')

class authMail{
  constructor(data){
    this.data = data
  }
  
  sendMail(){
    
    let schema = {
      authtype: 'email',
      emailaddress: this.data.email,
      //uid: encrypt(this.data.otp, this.data.uid),
      ip: this.data.ip,
      timestamp: this.data.timestamp,
      verified: false
    }
    //mailer(schema.otp, this.data.email, this.data.res)
    
  }
}

module.exports = { 
  authMail
}
