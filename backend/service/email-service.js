import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const createMailtrapTransporter = () => {
  return nodemailer.createTransport({
    host: env.mailtrapHost,
    port: Number(env.mailtrapPort),
    secure: false,
    auth: {
      user: env.mailtrapUser,
      pass: env.mailtrapPass,
    },
  });
};

const sendWithBrevoApi = async ({ to, subject, html, text }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": env.brevoApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: extractSenderName(env.mailFrom),
        email: extractSenderEmail(env.mailFrom),
      },
      to: Array.isArray(to)
        ? to.map((email) => ({ email }))
        : [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Brevo API Error:", data);
    throw new Error(data.message || "Failed to send email with Brevo API");
  }

  console.log("Email sent successfully with Brevo API:", data);
  return data;
};

const sendWithMailtrap = async ({ to, subject, html, text }) => {
  const transporter = createMailtrapTransporter();

  const info = await transporter.sendMail({
    from: env.mailFrom,
    to,
    subject,
    text,
    html,
  });

  console.log("Email sent successfully with Mailtrap:", info.messageId);
  return info;
};

const extractSenderEmail = (mailFrom) => {
  const match = mailFrom.match(/<(.+?)>/);
  return match ? match[1] : mailFrom;
};

const extractSenderName = (mailFrom) => {
  const match = mailFrom.match(/^(.*?)\s*<.+?>$/);
  return match ? match[1].replace(/"/g, "").trim() : "No Reply";
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (env.emailProvider === "brevo") {
      return await sendWithBrevoApi({ to, subject, html, text });
    }

    return await sendWithMailtrap({ to, subject, html, text });
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};