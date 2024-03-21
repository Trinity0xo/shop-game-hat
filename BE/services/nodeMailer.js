const generateOAuthAccessToken = require("../utils/generateOAuthAccessToken.js");
const nodemailer = require("nodemailer");
const { env } = require("../config/env.js");

const emailService = async (options) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      clientId: env.NODEMAILER_GOOGLE_CLIENT_ID,
      clientSecret: env.NODEMAILER_GOOGLE_CLIENT_SECRET,
    },
  });

  const { token } = await generateOAuthAccessToken();

  if (!token) {
    throw new Error("Unable to generate OAuth token");
  }

  const MailOptions = {
    from: `Shop game HAT <${env.GOOGLE_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    auth: {
      user: env.NODEMAILER_GOOGLE_EMAIL,
      refreshToken: env.NODEMAILER_GOOGLE_REFRESH_TOKEN,
      accessToken: token,
    },
  };

  transport.sendMail(MailOptions);
};

module.exports = emailService;
