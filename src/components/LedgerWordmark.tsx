import Image from "next/image";

// The drawn signature as the ledger letterhead. PNG (54KB, cached) over the
// 220KB+ SVG; ink mode inverts it via .ledger-wordmark in globals.css.
export default function LedgerWordmark({
  className = "h-8 w-auto",
}: {
  className?: string;
}) {
  return (
    <Image
      src="/icons/maxwellyoung2.png"
      alt="Maxwell Young"
      width={1024}
      height={483}
      priority
      className={`ledger-wordmark ${className}`}
    />
  );
}
