export const verificationEmailTemplate = (name, verificationLink) => {
  return {
    subject: "Verify your account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${name || "there"},</h2>
        <p>Thank you for registering.</p>
        <p>Please click the button below to verify your account:</p>
        <a 
          href="${verificationLink}" 
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #28a745;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          Verify Account
        </a>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p>${verificationLink}</p>
      </div>
    `,
  };
};