"use client";

import { usePathname } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "~/components/ui/drawer";
import { NavigationItem } from "./NavigationItem";
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
      <DrawerContent className="max-h-[85vh]">
        <DrawerTitle className="sr-only">Navigation</DrawerTitle>
        <nav
          className="flex flex-col gap-1 p-4 pb-8"
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isActive(item.href)}
              onClick={handleClose}
              layoutId="nav-indicator-mobile"
            />
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
