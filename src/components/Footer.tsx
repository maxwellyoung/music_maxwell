import Link from "next/link";
import { Instagram, Twitter, Youtube, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-24 w-full border-t border-border bg-background/60 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="https://instagram.com/maxwell_young"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-accent focus:text-accent"
          >
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link
            href="https://twitter.com/internetmaxwell"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-accent focus:text-accent"
          >
            <Twitter className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="https://www.youtube.com/@maxwell_young"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-accent focus:text-accent"
          >
            <Youtube className="h-6 w-6" />
            <span className="sr-only">YouTube</span>
          </Link>
          <Link
            href="/forum"
            className="group relative text-muted-foreground transition-colors hover:text-accent focus:text-accent"
            aria-label="Forum"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
              Forum
            </span>
          </Link>
        </div>
        <div className="text-center text-base font-medium text-muted-foreground">
          © {new Date().getFullYear()} Maxwell Young. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
