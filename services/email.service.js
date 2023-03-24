const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates');
const path = require('path');

const { SYSTEM_MAIL, SYSTEM_MAIL_PASSWORD, FRONTEND_URL } = require('../config/config');
const templateInfoObject = require('../email-templates');
const ApiError = require('../error/ApiError');

const sendMail = async (receiverMail, emailAction, locals = {}) => { // emailActionEnum.WELCOME
  const templateRenderer = new EmailTemplate({
    views: {
      root: path.join(process.cwd(), 'email-templates')
    }
  });

  const templateInfo = templateInfoObject[emailAction];

  if (!templateInfo) {
    throw new ApiError('Wrong email action')
  }

  Object.assign(locals, { frontendURL: FRONTEND_URL })

  const html = await templateRenderer.render(templateInfo.templateName, locals);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      pass: SYSTEM_MAIL_PASSWORD,
      user: SYSTEM_MAIL
    }
  });

  await transporter.sendMail({
    from: SYSTEM_MAIL,
    to: receiverMail,
    subject: templateInfo.subject,
    html
  })
}

module.exports = {
  sendMail
}
