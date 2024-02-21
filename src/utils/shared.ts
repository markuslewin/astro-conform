import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { sendMessage } from "./message";

// The form schema
export const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  message: z
    .string({ required_error: "Message is required" })
    .min(10, "Message is too short")
    .max(100, "Message is too long"),
});

// Parse the form data and run the app logic
export async function parseAndSendMessage(request: Request) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return {
      success: false,
      reply: submission.reply(),
    } as const;
  }

  const message = await sendMessage(submission.value);

  if (!message.sent) {
    return {
      success: false,
      reply: submission.reply({
        formErrors: ["Failed to send the message. Please try again later."],
      }),
    } as const;
  }

  return { success: true } as const;
}
