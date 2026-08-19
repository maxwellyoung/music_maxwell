import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lab | Maxwell Young",
  robots: { index: false, follow: false },
};

const variants = [
  { href: "/lab/minimal", label: "A · Minimal" },
  { href: "/lab/void", label: "B · Void" },
  { href: "/lab/broadsheet", label: "C · Broadsheet" },
  { href: "/", label: "Current site" },
];

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <nav
        aria-label="Design variants"
        className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-black/10 bg-white/90 px-2 py-1 text-[11px] font-medium text-black shadow-lg backdrop-blur-sm"
      >
        {variants.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="rounded-full px-3 py-1.5 transition hover:bg-black hover:text-white"
          >
            {v.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
