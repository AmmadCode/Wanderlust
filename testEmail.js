require("dotenv").config();
const { sendOTPEmail } = require("./utils/emailService");

const test = async () => {
  try {
    await sendOTPEmail("m.usman.8460@gmail.com", "123456");
    console.log("✅ Test email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send test email:", err);
  }
};

test();
