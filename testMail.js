require("dotenv").config();
const sendEmail = require("./utils/sendEmail");

(async () => {
  try {
    await sendEmail("mhdshanis3@gmail.com", "Test Mail", "<h1>Hello!</h1><p>This is a test email.</p>");
    console.log("✅ Test email sent successfully");
  } catch (err) {
    console.error("❌ Failed to send test email:", err.message);
  }
})();
