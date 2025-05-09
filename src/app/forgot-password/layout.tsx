import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Maxwell Young Forum",
  description: "Reset your Maxwell Young forum account password.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
