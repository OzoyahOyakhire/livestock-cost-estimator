import dotenv from "dotenv";

dotenv.config();

export const env = {
  emailProvider: process.env.EMAIL_PROVIDER,
  mailFrom: process.env.MAIL_FROM,

  brevoApiKey: process.env.BREVO_API_KEY,

  mailtrapHost: process.env.MAILTRAP_HOST,
  mailtrapPort: process.env.MAILTRAP_PORT,
  mailtrapUser: process.env.MAILTRAP_USER,
  mailtrapPass: process.env.MAILTRAP_PASS,
};