import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function verifySmtpConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}

interface SendAdminReplyOptions {
  to: string;
  subject: string;
  message: string;
  originalMessage: string;
  recipientName: string;
}

export async function sendAdminReply({
  to,
  subject,
  message,
  originalMessage,
  recipientName,
}: SendAdminReplyOptions): Promise<void> {
  const fromName = process.env.MAIL_FROM_NAME ?? "Kashf Production";
  const fromAddress = process.env.SMTP_USER ?? "hello@kashf.tn";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#111111;padding:28px 36px;border-radius:12px 12px 0 0;">
              <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.04em;">
                KASHF PRODUCTION
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px;border-left:1px solid #e5e5e5;border-right:1px solid #e5e5e5;">
              <p style="margin:0 0 8px 0;color:#737373;font-size:13px;">
                Hi ${recipientName},
              </p>
              <div style="color:#171717;font-size:15px;line-height:1.7;white-space:pre-wrap;margin:0 0 32px 0;">${escapeHtml(message)}</div>

              <!-- Quoted original -->
              <div style="border-left:3px solid #e5e5e5;padding:16px 20px;background:#fafafa;border-radius:0 8px 8px 0;">
                <p style="margin:0 0 10px 0;color:#a3a3a3;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                  Your original message
                </p>
                <div style="color:#737373;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(originalMessage)}</div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px 36px;border:1px solid #e5e5e5;border-radius:0 0 12px 12px;">
              <p style="margin:0;color:#a3a3a3;font-size:12px;line-height:1.5;">
                This email was sent by <strong style="color:#737373;">${fromName}</strong>.
                You can reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Hi ${recipientName},`,
    "",
    message,
    "",
    "--- Your original message ---",
    originalMessage,
    "",
    `— ${fromName}`,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      html,
      text,
    });
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException & {
      responseCode?: number;
      command?: string;
    };

    if (e.responseCode === 535 || e.message?.toLowerCase().includes("authentication")) {
      throw new Error("SMTP authentication failed — check SMTP_USER and SMTP_PASSWORD.");
    }
    if (e.code === "ECONNREFUSED") {
      throw new Error(`SMTP connection refused on ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}.`);
    }
    if (e.code === "ETIMEDOUT" || e.code === "ECONNRESET") {
      throw new Error(`SMTP connection timed out reaching ${process.env.SMTP_HOST}.`);
    }
    if (e.responseCode === 550 || e.responseCode === 553) {
      throw new Error(`Recipient address rejected by mail server: ${to}`);
    }

    throw new Error(`Failed to send email: ${e.message ?? "unknown error"}`);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
