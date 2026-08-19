"use client";

import { usePathname } from "next/navigation";

// /lab hosts full-page design experiments judged without site chrome.
export default function FooterGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (
    pathname === "/" ||
    pathname.startsWith("/r/") ||
    pathname.startsWith("/lab")
  )
    return null;
  return <>{children}</>;
}
