"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "~/components/ui/drawer";
import { springs } from "./spring-config";
import {
  MusicIcon,
  ForumIcon,
  RoomsIcon,
  VideosIcon,
  ShowsIcon,
  LyricsIcon,
  TimelineIcon,
  BtsIcon,
  GuestbookIcon,
} from "./icons";

interface NavigationMobileProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  { href: "/", label: "Music", icon: <MusicIcon /> },
  { href: "/forum", label: "Forum", icon: <ForumIcon /> },
  { href: "/rooms", label: "Rooms", icon: <RoomsIcon /> },
  { href: "/videos", label: "Videos", icon: <VideosIcon /> },
  { href: "/shows", label: "Shows", icon: <ShowsIcon /> },
  { href: "/lyrics", label: "Lyrics", icon: <LyricsIcon /> },
  { href: "/timeline", label: "Timeline", icon: <TimelineIcon /> },
  { href: "/bts", label: "Process", icon: <BtsIcon /> },
  { href: "/guestbook", label: "Guestbook", icon: <GuestbookIcon /> },
];

export function NavigationMobile({
  isOpen,
  onOpenChange,
}: NavigationMobileProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] border-white/10 bg-black">
        <DrawerTitle className="sr-only">Navigation</DrawerTitle>

        {/* Custom handle */}
        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-white/20" />

        <nav
          className="flex flex-col gap-1 px-4 pb-10 pt-6"
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springs.navigation, delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                onClick={handleClose}
                className="group relative flex items-center gap-4 rounded-xl px-4 py-4"
              >
                {/* Icon */}
                <span
                  className={`flex h-8 w-8 items-center justify-center transition-colors ${
                    isActive(item.href)
                      ? "text-white"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  className={`text-2xl font-light tracking-wide transition-colors ${
                    isActive(item.href)
                      ? "text-white"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="nav-mobile-indicator"
                    className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white"
                    transition={springs.navigation}
                  />
                )}

                {/* Hover background */}
                <div className="absolute inset-0 -z-10 rounded-xl bg-white/0 transition-colors group-hover:bg-white/5" />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Bottom branding */}
        <p className="pb-8 text-center text-xs tracking-[0.3em] text-white/20">
          MAXWELL YOUNG
        </p>
      </DrawerContent>
    </Drawer>
  );
}
