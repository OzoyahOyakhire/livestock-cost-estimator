import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const createTransporter = () => {
  if (env.emailProvider === "brevo") {
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

  return nodemailer.createTransport({
    host: env.mailtrapHost,
    port: env.mailtrapPort,
    secure: false,
    auth: {
      user: env.mailtrapUser,
      pass: env.mailtrapPass,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: env.mailFrom,
    to,
    subject,
    text,
    html,
  });

  return info;
};