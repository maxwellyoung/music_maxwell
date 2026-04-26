import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Maxwell Young",
  description: "Reset your Maxwell Young account password.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
