import { Resend } from "resend";

const resend = new Resend('re_9Uhd77Zk_HmgEbx2RsUyTfJkWp5A2MmRF');

export async function sendEmail(to, subject, html) {
    try {
        await resend.emails.send({
            from: "Online Shop <onboarding@resend.dev>",
            to,
            subject,
            html,
        });
        console.log("Email sent:", subject);
    } catch (err) {
        console.error("Email error:", err);
    }
}
