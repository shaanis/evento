const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // must be lowercase "gmail"
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // app password
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Cabbon" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
};

module.exports = sendEmail;
