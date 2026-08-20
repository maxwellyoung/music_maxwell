import LedgerKeys from "~/components/LedgerKeys";

// Ledger surfaces carry their own letterhead and colophon; no site chrome.
export default function LedgerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="main-content" tabIndex={-1} className="flex-1 outline-hidden">
      <LedgerKeys />
      {children}
    </div>
  );
}
