// Email utility - works in dev without SMTP configured.
// For production, integrate with your email provider (Resend, SendGrid, Postmark, etc.)
// or add nodemailer: npm install nodemailer && npm install @types/nodemailer -D

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(
  params: SendEmailParams
): Promise<{ success: boolean; devPreview?: string }> {
  const host = process.env.EMAIL_SERVER_HOST;
  const user = process.env.EMAIL_SERVER_USER;
  const password = process.env.EMAIL_SERVER_PASSWORD;

  // If SMTP not configured, dev fallback
  if (!host || !user || !password) {
    if (process.env.NODE_ENV === "development") {
      console.log("=== EMAIL DEV PREVIEW ===");
      console.log(`To: ${params.to}`);
      console.log(`Subject: ${params.subject}`);
      console.log(`Body: ${params.html.substring(0, 500)}`);
      console.log("=== END EMAIL PREVIEW ===");
      return { success: true, devPreview: params.html };
    }
    console.warn("Email not sent: SMTP not configured");
    return { success: false };
  }

  // In production with SMTP configured, log attempt.
  // TODO: Replace with actual email sending (nodemailer, Resend API, etc.)
  console.log(`[EMAIL] Attempting to send to ${params.to}: ${params.subject}`);
  return { success: false };
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  appUrl: string
): Promise<{ success: boolean; devPreview?: string }> {
  const link = `${appUrl}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2D5A27;">Verify Your Email</h1>
      <p>Thank you for registering on the Hillwalking Rental Platform!</p>
      <p>Please click the button below to verify your email address:</p>
      <a href="${link}" style="display: inline-block; padding: 12px 24px; background: #2D5A27; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Verify Email</a>
      <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
      <p style="color: #666; font-size: 14px;">If you did not create this account, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">Hillwalking Rental Platform</p>
    </div>
  `;
  return sendEmail({ to: email, subject: "Verify Your Email - Hillwalking Rental", html });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  appUrl: string
): Promise<{ success: boolean; devPreview?: string }> {
  const link = `${appUrl}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2D5A27;">Reset Your Password</h1>
      <p>We received a request to reset your password.</p>
      <p>Click the button below to set a new password:</p>
      <a href="${link}" style="display: inline-block; padding: 12px 24px; background: #2D5A27; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
      <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
      <p style="color: #666; font-size: 14px;">If you did not request this, please ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: "Reset Your Password - Hillwalking Rental", html });
}
