const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

// Create a single instance of Mailgen
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'SMAuth',
    link: 'http://localhost:5000/'
  }
});

// Create a transport instance with pool enabled
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    authMethod: "PLAIN"
  },
  pool: true,
  maxConnections: 5
});

const sendMail = async (uuid, recipientsEmail) => {
  try {
    // Generate email body
    const email = {
      body: {
        name: 'Hello there! 🙂',
        intro: 'This is your Authentication mail',
        action: {
          instructions: 'Click to confirm your email',
          button: {
            color: '#22BC66',
            text: 'Confirm your email',
            link: `https://localhost:5000/api/v1/auth/confirm?uuid=${uuid}`
          }
        },
        outro: 'This auth mail expires in 2mins'
      }
    };
    const emailBody = mailGenerator.generate(email);

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: recipientsEmail,
      subject: 'Email Authentication',
      html: emailBody
    });
    return info.response
  } catch (error) {
    console.error(error);
    return error.toString();
  }
};


module.exports = sendMail;
