import { Resend } from "resend";
import { z } from "zod";
import { publicAction } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { env } from "~/server/env";

const resend = new Resend(env.RESEND_API_KEY);

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export const action = publicAction(async ({ request }) => {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  try {
    const formData = await request.formData();
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    // Validate the form data
    const validatedData = contactFormSchema.parse(data);

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: "BIP Contact Form <contact@discobiscuits.net>",
      to: [env.CONTACT_EMAIL],
      replyTo: validatedData.email,
      subject: `Contact Form: ${validatedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${validatedData.name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${validatedData.email}</p>
            <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${validatedData.subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #6366f1; border-radius: 4px;">
              ${validatedData.message.replace(/\n/g, "<br>")}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
            <p>This message was sent from the Biscuits Internet Project contact form.</p>
            <p>Reply directly to this email to respond to ${validatedData.name}.</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

From: ${validatedData.name}
Email: ${validatedData.email}
Subject: ${validatedData.subject}

Message:
${validatedData.message}

---
This message was sent from the Biscuits Internet Project contact form.
Reply directly to this email to respond to ${validatedData.name}.
      `.trim(),
    });

    if (emailResult.error) {
      logger.error("Failed to send email", { error: emailResult.error });
      throw new Error("Failed to send email");
    }

    logger.info("Contact form email sent successfully", { emailId: emailResult.data?.id });

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    logger.error("Contact form submission error", { error });

    if (error instanceof z.ZodError) {
      return badRequest("Invalid form data");
    }

    throw error;
  }
});
