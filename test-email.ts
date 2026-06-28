import "dotenv/config";
import { sendEmail } from "./src/server/features/notifications/notification.service";

async function run() {
  try {
    const result = await sendEmail({
      to: "test@example.com",
      toName: "Test User",
      senderName: "Admin",
      messageText: "This is a test message.",
    });
    console.log("Success:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

run();
