/* eslint-disable */
// @ts-nocheck
import { hash, compare } from "bcryptjs";
import { render } from "@react-email/render";
import ResetPasswordEmail from "~/emails/ResetPasswordEmail";
import { resend } from "~/lib/resend";

export async function hashToken(token: string): Promise<string> {
  return hash(token, 12);
}

export async function verifyToken(
  token: string,
  hashTokenStr: string,
): Promise<boolean> {
  return compare(token, hashTokenStr);
}

export async function sendResetEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset?token=${token}`;
  const html = render(<ResetPasswordEmail url={url} />);

  const res = await resend.emails.send({
    from: process.env.RESEND_SENDER!,
    to,
    subject: "Reset your password",
    html,
  });

  if (res.error) {
    throw new Error("Failed to send email");
  }

  return res;
}
