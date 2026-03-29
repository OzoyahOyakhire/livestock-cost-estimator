import { sendEmail } from "../service/email-service.js";

export const sendResetPasswordEmail = async ({
  name,
  email,
  resetPasswordLink,
}) => {
  const subject = "Reset your password";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello ${name || "there"},</h2>
      <p>You requested to reset your password.</p>
      <p>Click the button below to set a new password:</p>
      <a
        href="${resetPasswordLink}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background: #dc3545;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Reset Password
      </a>
      <p>If you did not request this, please ignore this email.</p>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p>${resetPasswordLink}</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    html,
    text: `Reset your password here: ${resetPasswordLink}`,
  });
};