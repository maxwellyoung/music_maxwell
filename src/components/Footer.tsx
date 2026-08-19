import Link from "next/link";
import { ArrowUpRight, Instagram, Twitter, Youtube } from "lucide-react";

const siteLinks = [
  { label: "Music", href: "/" },
  { label: "Notes", href: "/forum" },
  { label: "Artwork", href: "/artwork/sneakin-drinks" },
  { label: "Quiz", href: "/quiz" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#11100f] px-5 pb-8 pt-14 text-white sm:px-8 sm:pt-20 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-white/20 pb-12 lg:grid-cols-[0.62fr_0.38fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
              Keep wandering
            </p>
            <p className="font-reenie mt-4 max-w-2xl text-5xl leading-[0.85] text-white/75 sm:text-6xl">
              music / notes / things left in the margins
            </p>
          </div>
          <nav className="border-b border-white/20" aria-label="Footer">
            {siteLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between border-t border-white/20 py-3 text-lg font-semibold transition hover:text-white/60"
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-6 pt-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/maxwell_young"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/45 transition hover:text-white"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/internetmaxwell"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/45 transition hover:text-white"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/@maxwell_young"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/45 transition hover:text-white"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            © {new Date().getFullYear()} Maxwell Young · New Zealand
          </div>
        </div>
      </div>
    </footer>
  );
}
