import { verificationEmailTemplate } from "./email-template.js";
import { sendEmail } from "../service/email-service.js";

export const sendVerificationEmail = async ({
  name,
  email,
  verificationLink,
}) => {
  const { subject, html } = verificationEmailTemplate(
    name,
    verificationLink
  );

  // 👇 THIS is where sendEmail belongs
  await sendEmail({
    to: email,
    subject,
    html,
    text: `Verify your account here: ${verificationLink}`,
  });
};