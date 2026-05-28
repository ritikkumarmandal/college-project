import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html: html || `<p>${text}</p>`,
    });

    console.log("Email sent:", response);

  } catch (error) {
    console.error("Email error:", error);
  }
};