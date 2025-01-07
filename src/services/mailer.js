const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');


const mailerjs = async (smptConfig, mailgenConfig, mailTemplate) => {
  
  if(typeof smptConfig === 'undefined' || typeof mailgenConfig === 'undefined' || typeof mailTemplate === 'undefined'){
    throw new Error('A parameter was left blank');
  }
  
  if(typeof smptConfig !== 'object' || typeof mailgenConfig !== 'object' || typeof mailTemplate !== 'object'){
    throw new Error('All parameter values must be an object');
  }
  
  // Creates an instance of Mailgen
  const mailGenerator = new Mailgen({
    theme: mailgenConfig.theme ?? 'default',
    product: {
      name: mailgenConfig.projectName,
      link: mailgenConfig.indexLink
    }
  });
  
  // Creates a transport instance
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smptConfig.user,
      pass: smptConfig.appPassword,
      authMethod: "PLAIN"
    },
    pool: true,
    maxConnections: 5
  });
  
  // Generates email body
    const email = {
      body: {
        name: mailTemplate.heading,
        intro: mailTemplate.introText,
        action: {
          instructions: mailTemplate.action.instruction,
          button: {
            color: mailTemplate.action.button.color ??  '#22BC66',
            text: mailTemplate.action.button.text,
            link: mailTemplate.action.button.link
          }
        },
        outro: mailTemplate.outroText
      }
    };
    const emailBody = mailGenerator.generate(email);
    
    // Sends email
    try {
      const info = await transporter.sendMail({
      from: smptConfig.user,
      to: smptConfig.recipientsEmail,
      subject: smptConfig.subject,
      html: emailBody
    });
    return true 
    } catch (error) {
      if (error.code === 'EAUTH') {
      console.error('Authentication error:', error);
      throw new Error('Authentication failed. Please check your email credentials.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('DNS lookup error:', error);
      throw new Error('Error resolving SMTP server address. Please try again later.');
    } else if (error.code === 'ECONNRESET') {
      console.error('Connection reset error:', error);
      throw new Error('Error establishing a secure connection to the SMTP server. Please try again later.');
    } else {
      console.error('Unknown error:', error);
      throw new Error('An unknown error occurred. Please try again later.');
    }
  }
}

module.exports = mailerjs