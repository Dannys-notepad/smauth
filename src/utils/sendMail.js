const mailer = require('../services/mailer')

const sendMail = async (email, uuid) => {
  let smptConfig = {
    user: process.env.SMTP_USER,
    appPassword: process.env.SMTP_PASS,
    subject: 'SMAuth',
    recipientsEmail: email
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
        link: 'http://localhost:5000/auth?uuid='+uuid
      }
    },
    outroText: ''
  }
  try{
    const sendMail = await mailer(smptConfig, mailgenConfig, mailTemplate)
    if(sendMail){
      return true 
    }
  }catch(error){
    return error 
  }
}

module.exports = sendMail