import { Resend } from "resend";

// Constructed on first use: Resend throws without a key, and route modules are
// evaluated at build time (CI has no RESEND_API_KEY).
let client: Resend | undefined;

export function getResend(): Resend {
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}
