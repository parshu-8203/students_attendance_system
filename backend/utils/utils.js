const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASS,
  },
});

const sendResetLinkEmail = async (to, subject, content) => {
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to,
    subject,
    text: content,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

const generateResetToken = () => {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
};

module.exports = { sendResetLinkEmail, generateResetToken };
