import React from "react";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
} from "~/components/ui/drawer";
import { type Song } from "~/types";

interface SongDrawerProps {
  song: Song;
  open: boolean;
  onClose: () => void;
}

export function SongDrawer({ song, open, onClose }: SongDrawerProps) {
  const [defaultLyricVersion] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      window.navigator.vibrate?.(3);
    }
  }, [open]);

  const formatText = (text: string | undefined) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const getLyrics = () => {
    try {
      const lyrics =
        song.title === "In My 20s"
          ? song.lyrics[defaultLyricVersion]
          : song.lyrics[0];

      return formatText(lyrics) ?? "Lyrics not available";
    } catch (error) {
      console.error("[SongDrawer] Error getting lyrics:", error);
      return "Lyrics not available";
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="pb-safe fixed inset-x-0 bottom-0 mt-24 h-[85vh] rounded-t-[10px] bg-black/95">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            damping: 40,
            stiffness: 200,
            mass: 1.2,
            duration: 0.3,
          }}
          className="flex h-full flex-col"
        >
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-white/10" />
          <div className="sticky top-0 z-10 bg-black/80 px-4 pb-4 pt-3 backdrop-blur-xl sm:px-6">
            <DrawerHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white sm:text-xl">
                  {song.title}
                </h2>
                <DrawerClose
                  className="rounded-lg p-2 text-white/50 transition-colors hover:text-white/75 focus-visible:ring-2 focus-visible:ring-white/50"
                  aria-label="Close lyrics"
                >
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </DrawerClose>
              </div>
            </DrawerHeader>

            {/* Mobile streaming links */}
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 md:hidden">
              {/* Streaming links content */}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 sm:px-6">
            <div className="prose prose-invert max-w-none">{getLyrics()}</div>
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}

SongDrawer.displayName = "SongDrawer";
