import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const createTransporter = () => {
  if (env.emailProvider === "brevo" && env.brevoHost) {
    return nodemailer.createTransport({
      host: env.brevoHost,
      port: env.brevoPort,
      secure: false,
      auth: {
        user: env.brevoUser,
        pass: env.brevoPass,
      },
    });
  }

  if (env.mailtrapHost && env.mailtrapUser) {
    return nodemailer.createTransport({
      host: env.mailtrapHost,
      port: env.mailtrapPort,
      secure: false,
      auth: {
        user: env.mailtrapUser,
        pass: env.mailtrapPass,
      },
    });
  }
  
  return null;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log("-------------------------------------------------");
    console.log("📧 MOCK EMAIL SENT (No provider configured in .env)");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);
    console.log("-------------------------------------------------");
    return { messageId: "mock-id" };
  }

  const info = await transporter.sendMail({
    from: env.mailFrom || '"Livestock Cost Estimator" <no-reply@livestock.com>',
    to,
    subject,
    text,
    html,
  });

  return info;
};