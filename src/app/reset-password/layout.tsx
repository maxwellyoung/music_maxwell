import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Maxwell Young Forum",
  description: "Reset your Maxwell Young forum account password.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
