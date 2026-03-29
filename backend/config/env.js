import dotenv from "dotenv";

dotenv.config();

export const env = {
  emailProvider: process.env.EMAIL_PROVIDER || "mailtrap",
  mailFrom: process.env.MAIL_FROM,

  mailtrapHost: process.env.MAILTRAP_HOST,
  mailtrapPort: Number(process.env.MAILTRAP_PORT) || 2525,
  mailtrapUser: process.env.MAILTRAP_USER,
  mailtrapPass: process.env.MAILTRAP_PASS,

  brevoHost: process.env.BREVO_HOST,
  brevoPort: Number(process.env.BREVO_PORT) || 587,
  brevoUser: process.env.BREVO_USER,
  brevoPass: process.env.BREVO_PASS,
};