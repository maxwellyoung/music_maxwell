import Link from "next/link";
import { Instagram, Twitter, Youtube, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#11100f] px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 border-t border-white/20 pt-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="https://instagram.com/maxwell_young"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative text-white/55 transition-colors hover:text-[#ff8eaa] focus:text-[#ff8eaa]"
            aria-label="Instagram"
          >
            <Instagram className="h-6 w-6" />
            <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
              Instagram
            </span>
          </Link>
          <Link
            href="https://twitter.com/internetmaxwell"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative text-white/55 transition-colors hover:text-[#ff8eaa] focus:text-[#ff8eaa]"
            aria-label="Twitter"
          >
            <Twitter className="h-6 w-6" />
            <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
              Twitter
            </span>
          </Link>
          <Link
            href="https://www.youtube.com/@maxwell_young"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative text-white/55 transition-colors hover:text-[#ff8eaa] focus:text-[#ff8eaa]"
            aria-label="YouTube"
          >
            <Youtube className="h-6 w-6" />

            <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
              YouTube
            </span>
          </Link>
          <Link
            href="/forum"
            className="group relative text-white/55 transition-colors hover:text-[#ff8eaa] focus:text-[#ff8eaa]"
            aria-label="Notes"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
              Notes
            </span>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
          <span>© {new Date().getFullYear()} Maxwell Young · New Zealand</span>
          <Link href="/privacy" className="transition hover:text-white focus:text-white">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
