import { hash, compare } from "bcryptjs";
import { render } from "@react-email/render";
import ResetPasswordEmail from "~/emails/ResetPasswordEmail";
import { resend } from "~/lib/resend";

const HASH_ROUNDS = 12;

export async function hashToken(token: string): Promise<string> {
  return hash(token, HASH_ROUNDS);
}

export async function verifyToken(
  token: string,
  hashedToken: string,
): Promise<boolean> {
  return compare(token, hashedToken);
}

interface SendResetEmailParams {
  to: string;
  token: string;
}

export async function sendResetEmail({
  to,
  token,
}: SendResetEmailParams): Promise<{ id: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured");
  }

  const sender = process.env.RESEND_SENDER;
  if (!sender) {
    throw new Error("RESEND_SENDER is not configured");
  }

  const url = `${baseUrl}/reset?token=${token}`;
  const html = await render(<ResetPasswordEmail url={url} />);

  const res = await resend.emails.send({
    from: sender,
    to,
    subject: "Reset your password",
    html,
  });

  if (res.error) {
    throw new Error(`Failed to send email: ${res.error.message}`);
  }

  if (!res.data) {
    throw new Error("Failed to send email: no response data");
  }

  return res.data;
}
