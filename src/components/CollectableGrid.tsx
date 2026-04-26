"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/select";
import type { CarouselApi } from "./ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import songs from "./songsData";
import { cn } from "~/lib/utils";
import { XIcon } from "lucide-react";

// Define the Song type
type Song = {
  title: string;
  artist: string;
  artwork: string;
  links: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    microsite?: string;
    smartLink?: string;
    tidal?: string;
    pandora?: string;
  };
  lyrics?: Record<string, string>;
  credits?: string;
  videoLink?: string;
  previewUrl?: string;
  releaseDate?: string;
  releaseDateLabel?: string;
  duration?: string;
  releaseType?: string;
  tagline?: string;
};

type StreamingLink = {
  label: string;
  href: string;
  className: string;
  shortLabel?: string;
};

const photos = [
  { src: "/pressphotos/4.jpg", alt: "Press Photo 4" },
  { src: "/pressphotos/3.jpeg", alt: "Press Photo 3" },
  { src: "/pressphotos/1.jpg", alt: "Press Photo 1" },
  { src: "/pressphotos/2.jpeg", alt: "Press Photo 2" },
];

// Add a reusable BlurImage component
const BlurImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
      quality={90}
      priority={src.includes("TurnItUp") || src.includes("Freewheelin")} // Prioritize first few images
      className={cn(
        "object-cover duration-700 ease-in-out",
        isLoading
          ? "scale-105 blur-2xl grayscale"
          : "scale-100 blur-0 grayscale-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLi44QzxAOEE4Ny42RUhMSk1RV1pZXTpBW2GBgWj/2wBDARUXFx4aHR4eHUE6LTo9QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
};

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string | undefined): string | null => {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = regExp.exec(url);
  const id = match?.[2];

  return id?.length === 11 ? id : null;
};

const renderTextWithEmbeds = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (/^https?:\/\/soundcloud\.com\/[^\s]+$/.test(part)) {
      return (
        <iframe
          key={`${part}-${index}`}
          title={`SoundCloud player ${index + 1}`}
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(part)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
        />
      );
    }

    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

// YouTube Thumbnail component
const YouTubeThumbnail = ({
  videoUrl,
  alt,
}: {
  videoUrl: string;
  alt: string;
}) => {
  const [isLoading, setLoading] = useState(true);
  const videoId = getYouTubeVideoId(videoUrl);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "/placeholder.svg";

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <Image
        src={thumbnailUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={85}
        className={cn(
          "object-cover duration-700 ease-in-out",
          isLoading
            ? "scale-105 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0",
        )}
        onLoad={() => setLoading(false)}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLi44QzxAOEE4Ny42RUhMSk1RV1pZXTpBW2GBgWj/2wBDARUXFx4aHR4eHUE6LTo9QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
};

const PressPhotoCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      setApi={setApi}
      className="mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg"
    >
      <CarouselContent className="rounded-lg">
        {photos.map((photo, index) => (
          <CarouselItem key={photo.src} className="basis-full">
            <motion.div
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden rounded-lg"
            >
              <div className="group relative aspect-[3/4] w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="rounded-lg object-cover transition duration-300 ease-out will-change-transform"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
              </div>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-center gap-2">
        <CarouselPrevious
          onClick={() => {
            vibrate(2);
            api?.scrollPrev();
          }}
          className="bg-neutral-900/80 text-white backdrop-blur-sm transition hover:bg-neutral-800/80"
        />
        <div className="flex gap-1">
          {Array.from({ length: count }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                vibrate(2);
                api?.scrollTo(index);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === current ? "w-6 bg-white" : "w-1.5 bg-white/20",
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
        <CarouselNext
          onClick={() => {
            vibrate(2);
            api?.scrollNext();
          }}
          className="bg-neutral-900/80 text-white backdrop-blur-sm transition hover:bg-neutral-800/80"
        />
      </div>
    </Carousel>
  );
};

// Add haptic feedback utility
const vibrate = (pattern: number | number[]) => {
  if (typeof window !== "undefined" && "navigator" in window) {
    try {
      window.navigator.vibrate(pattern);
    } catch {
      // Optional haptics should never block the interaction.
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeOut",
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const linkClassNames =
  "flex items-center gap-2 rounded-full px-4 py-2 transition-colors";

const streamingLinks = (song: Song): StreamingLink[] =>
  [
    song.links.smartLink
      ? {
          label: "All Links",
          shortLabel: "Listen",
          href: song.links.smartLink,
          className: "bg-white/10 text-white hover:bg-white/20",
        }
      : null,
    song.links.spotify
      ? {
          label: "Spotify",
          href: song.links.spotify,
          className: "bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20",
        }
      : null,
    song.links.appleMusic
      ? {
          label: "Apple Music",
          shortLabel: "Apple",
          href: song.links.appleMusic,
          className: "bg-[#FB233B]/10 text-[#FB233B] hover:bg-[#FB233B]/20",
        }
      : null,
    song.links.youtube
      ? {
          label: "YouTube",
          href: song.links.youtube,
          className: "bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000]/20",
        }
      : null,
    song.links.tidal
      ? {
          label: "Tidal",
          href: song.links.tidal,
          className: "bg-cyan-300/10 text-cyan-200 hover:bg-cyan-300/20",
        }
      : null,
    song.links.pandora
      ? {
          label: "Pandora",
          href: song.links.pandora,
          className: "bg-blue-400/10 text-blue-200 hover:bg-blue-400/20",
        }
      : null,
    song.links.microsite
      ? {
          label: "Release Site",
          shortLabel: "Site",
          href: song.links.microsite,
          className: "bg-white/10 text-white hover:bg-white/20",
        }
      : null,
  ].filter(Boolean) as StreamingLink[];

const releaseFacts = (song: Song) =>
  [
    song.releaseDate
      ? { label: song.releaseDateLabel ?? "Released", value: song.releaseDate }
      : null,
    song.duration ? { label: "Runtime", value: song.duration } : null,
    song.releaseType ? { label: "Format", value: song.releaseType } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

const RELEASE_DATE = new Date("2026-04-30T00:00:00+12:00");

function getReleaseStatus() {
  const diff = RELEASE_DATE.getTime() - Date.now();
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  if (diff <= 0) return "Out now";
  if (days === 1) return "Out tomorrow";
  return `${days} days`;
}

const releaseClues = [
  "fluent in false alarms",
  "mirror and my match",
  "bar lights / field smoke",
];

function ReleaseWeekPanel() {
  const [status, setStatus] = useState("Out Thursday");

  useEffect(() => {
    setStatus(getReleaseStatus());
    const timer = window.setInterval(
      () => setStatus(getReleaseStatus()),
      60000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mt-6 border-t border-foreground/10 pt-5">
      <div className="grid gap-2 sm:grid-cols-3">
        {releaseClues.map((clue, index) => (
          <div
            key={clue}
            className={cn(
              "min-h-20 border border-foreground/10 bg-[#f5efe6]/50 px-4 py-4",
              index === 1 && "bg-[#e7edf2]/55",
              index === 2 && "bg-[#f4d4dd]/45",
            )}
          >
            <p className="font-reenie text-3xl leading-none text-foreground/75">
              {clue}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-3 border border-foreground/10 bg-background/35 px-4 py-3 text-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/45">
            Sneakin Drinks Into Bars
          </p>
          <p className="mt-1 text-lg font-semibold leading-tight">{status}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/artwork/sneakin-drinks"
            className="rounded-full bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-background transition hover:bg-foreground/85"
          >
            Artwork
          </Link>
          <Link
            href="/forum/new?title=Sneakin%20Drinks%20release%20week&content=Favourite%20line%2C%20night-out%20memory%2C%20or%20false%20alarm."
            className="rounded-full bg-background/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-foreground/70 transition hover:text-accent"
          >
            Notes
          </Link>
        </div>
      </div>
    </div>
  );
}

const AudioPreview = ({ song }: { song: Song }) => {
  if (!song.previewUrl) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
          Preview
        </p>
        <p className="truncate text-sm font-medium text-white/70">
          {song.title}
        </p>
      </div>
      <audio
        className="h-10 w-full"
        controls
        preload="none"
        src={song.previewUrl}
      >
        <a href={song.previewUrl}>Play preview</a>
      </audio>
    </div>
  );
};

const StreamingLinks = ({
  song,
  compact = false,
}: {
  song: Song;
  compact?: boolean;
}) => {
  const links = streamingLinks(song);
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            compact
              ? "flex h-8 items-center justify-center rounded-full px-3 text-xs font-bold uppercase tracking-[0.14em] transition-colors"
              : linkClassNames,
            link.className,
          )}
          onClick={() => vibrate(3)}
          aria-label={link.label}
        >
          <span className={compact ? "" : "text-sm font-medium"}>
            {compact ? link.shortLabel ?? link.label : link.label}
          </span>
        </a>
      ))}
    </div>
  );
};

const SongDrawer = ({
  song,
  open,
  onClose,
}: {
  song: Song;
  open: boolean;
  onClose: () => void;
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string>(
    song.lyrics ? Object.keys(song.lyrics)[0] ?? song.title : song.title,
  );

  useEffect(() => {
    if (open) {
      vibrate(3);
    }
  }, [open]);

  useEffect(() => {
    setSelectedVersion(
      song.lyrics ? Object.keys(song.lyrics)[0] ?? song.title : song.title,
    );
  }, [song]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeOut", duration: 0.3 },
    },
  };

  // Format lyrics to ensure consistent indentation
  const formatText = (text: string | undefined) => {
    if (!text) return "";
    return text
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  };

  // Get the lyrics safely with proper type checking
  const getLyrics = (): string => {
    if (!song.lyrics) return "";
    return song.lyrics[selectedVersion] ?? "";
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DrawerContent className="pb-safe fixed inset-x-0 bottom-0 mt-24 h-[85vh] rounded-t-[10px] bg-black/95">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "tween",
            duration: 0.4,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="flex h-full flex-col"
        >
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-white/10" />
          <div className="sticky top-0 z-10 bg-black/80 px-4 pb-4 pt-3 backdrop-blur-xl sm:px-6">
            <DrawerHeader>
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-lg font-medium text-white sm:text-xl">
                  {song.title}
                </DrawerTitle>
                <DrawerClose className="rounded-lg p-2 text-white/50 transition-colors hover:text-white/75">
                  <XIcon className="h-5 w-5" />
                </DrawerClose>
              </div>
              <DrawerDescription className="sr-only">
                Streaming links, artwork, video, lyrics, and credits for{" "}
                {song.title}.
              </DrawerDescription>

              <div className="mt-4 md:hidden">
                <StreamingLinks song={song} compact />
              </div>
            </DrawerHeader>
          </div>

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 pb-8 sm:px-6"
          >
            <div className="mx-auto w-full max-w-6xl">
              <div className="mt-4 grid grid-cols-1 gap-6 sm:mt-6 md:grid-cols-2 md:gap-8">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                  }}
                  className="w-full md:sticky md:top-6 md:self-start"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg">
                    <BlurImage src={song.artwork} alt={song.title} />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col space-y-4 sm:space-y-6"
                >
                  <div className="space-y-3">
                    {song.tagline && (
                      <p className="text-base font-medium leading-relaxed text-white/75">
                        {song.tagline}
                      </p>
                    )}
                    {releaseFacts(song).length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {releaseFacts(song).map((fact) => (
                          <div
                            key={fact.label}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                              {fact.label}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">
                              {fact.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <AudioPreview song={song} />

                  {/* Desktop streaming links */}
                  {streamingLinks(song).length > 0 && (
                    <div className="hidden space-y-4 md:block">
                      <h3 className="text-base font-medium text-white sm:text-lg">
                        Listen Now
                      </h3>
                      <StreamingLinks song={song} />
                    </div>
                  )}

                  {song.videoLink && (
                    <div className="relative w-full overflow-hidden rounded-lg">
                      <a
                        href={song.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block w-full"
                      >
                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                          <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:p-4">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="white"
                            >
                              <path d="M8 5.14v14l11-7-11-7z" fill="white" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <YouTubeThumbnail
                          videoUrl={song.videoLink}
                          alt={`${song.title} - Music Video`}
                        />
                      </a>
                    </div>
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    {song.lyrics && (
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-base font-medium text-white sm:text-lg">
                          Lyrics
                        </h3>

                        {Object.keys(song.lyrics).length > 1 ? (
                          <Select
                            value={selectedVersion}
                            onValueChange={(value) => {
                              vibrate(3);
                              setSelectedVersion(value);
                            }}
                          >
                            <SelectTrigger className="w-full border-zinc-800 bg-zinc-900/50 text-white">
                              <SelectValue placeholder="Select a version" />
                            </SelectTrigger>
                            <SelectContent className="border-zinc-800 bg-zinc-900 text-white">
                              {Object.keys(song.lyrics).map((version) => (
                                <SelectItem key={version} value={version}>
                                  {version}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : null}

                        <div className="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 max-h-[35vh] overflow-y-auto rounded-lg bg-zinc-900/50 p-3 font-mono text-sm leading-relaxed tracking-wide text-zinc-300 sm:max-h-[40vh] sm:p-4">
                          <div className="whitespace-pre-wrap text-left">
                            {renderTextWithEmbeds(formatText(getLyrics()))}
                          </div>
                        </div>
                      </div>
                    )}

                    {song.credits && (
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-base font-medium text-white sm:text-lg">
                          Credits
                        </h3>
                        <div className="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 max-h-[25vh] overflow-y-auto rounded-lg bg-zinc-900/50 p-3 font-mono text-sm leading-relaxed text-zinc-400 sm:max-h-[30vh] sm:p-4">
                          <div className="whitespace-pre-wrap text-left">
                            {renderTextWithEmbeds(formatText(song.credits))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
};

type CollectableGridProps = {
  showFeaturedHero?: boolean;
};

const CollectableGrid: React.FC<CollectableGridProps> = ({
  showFeaturedHero = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [error] = useState<string | null>(null);
  const featuredSong = songs[0] as Song;

  // Animation variants
  const albumVariants = {
    initial: { opacity: 0.95 },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    initial: { opacity: 1, y: 0 },
    hover: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const openDrawer = (song: Song) => {
    try {
      setSelectedSong(song);
      setIsOpen(true);
    } catch (error) {
      console.error("[CollectableGrid] Error opening drawer:", error);
    }
  };

  const closeDrawer = () => {
    try {
      setIsOpen(false);
      setTimeout(() => setSelectedSong(null), 300); // Clear song after animation
    } catch (error) {
      console.error("[CollectableGrid] Error closing drawer:", error);
    }
  };

  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden py-8 sm:py-12">
      {/* SVG noise overlay for artistic texture */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-soft-light">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
      <div className="container relative z-10 mx-auto px-2 sm:px-4 md:px-8">
        {error && error !== "NO_PRODUCTS" && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}

        {showFeaturedHero && (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 overflow-hidden border-y border-foreground/10 bg-[#f1eadf]/55 p-4 shadow-sm shadow-foreground/5 backdrop-blur-xl sm:p-6 md:mb-14"
          >
            <div className="grid gap-6 md:grid-cols-[1.08fr_0.92fr] md:items-center">
              <div className="relative z-10 space-y-5">
                <div className="inline-flex border border-foreground/10 bg-background/45 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-foreground/55">
                  Out Thursday
                </div>
                <div>
                  <h1 className="mb-3 text-5xl leading-[0.9] tracking-[-0.05em] text-foreground sm:text-7xl md:text-8xl">
                    {featuredSong.title}
                  </h1>
                  <p className="font-reenie max-w-xl text-3xl leading-none text-foreground/65 sm:text-4xl">
                    {featuredSong.tagline ??
                      "Listen now, then move through the archive."}
                  </p>
                </div>
                {releaseFacts(featuredSong).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {releaseFacts(featuredSong).map((fact) => (
                      <div
                        key={fact.label}
                        className="rounded-full border border-foreground/10 bg-background/45 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground/55"
                      >
                        {fact.label}:{" "}
                        <span className="text-foreground">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  {featuredSong.links.smartLink && (
                    <a
                      href={featuredSong.links.smartLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Listen Now
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => openDrawer(featuredSong)}
                    className="rounded-full bg-foreground px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-background transition hover:-translate-y-0.5 hover:bg-foreground/85 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    {featuredSong.previewUrl ? "Preview" : "Lyrics"}
                  </button>
                  {featuredSong.links.microsite && (
                    <a
                      href={featuredSong.links.microsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-primary/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-primary transition hover:-translate-y-0.5 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    >
                      Release Site
                    </a>
                  )}
                  <Link
                    href="/forum"
                    className="rounded-full bg-background/60 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-foreground/65 transition hover:-translate-y-0.5 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Notes
                  </Link>
                </div>
                {featuredSong.title === "Sneakin Drinks Into Bars" && (
                  <ReleaseWeekPanel />
                )}
              </div>

              <button
                type="button"
                onClick={() => openDrawer(featuredSong)}
                className="group relative aspect-square overflow-hidden bg-black shadow-xl shadow-accent/10 outline-none transition hover:-rotate-1 hover:scale-[1.015] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                aria-label={`Open ${featuredSong.title}`}
              >
                <BlurImage
                  src={featuredSong.artwork}
                  alt={featuredSong.title}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
                    Apr 30
                  </p>
                  <p className="mt-1 text-3xl font-bold leading-none text-white sm:text-5xl">
                    {featuredSong.title}
                  </p>
                </div>
              </button>
            </div>
          </motion.section>
        )}

        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Discography
            </p>
            <h2 className="mb-0 text-3xl leading-tight sm:text-4xl">
              Releases
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm font-medium text-foreground/50 sm:block">
            Tap artwork for credits, lyrics, videos, and links.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {songs.map((song, index) => (
            <motion.button
              key={song.title}
              type="button"
              initial="initial"
              whileHover="hover"
              onClick={() => openDrawer(song)}
              className="group cursor-pointer text-left focus:outline-none"
              aria-label={`Open ${song.title}`}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-black shadow-md shadow-primary/5 transition duration-200 ease-out group-hover:z-10 group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-primary/15 group-focus-visible:ring-4 group-focus-visible:ring-accent/25">
                <motion.div
                  variants={albumVariants}
                  className="relative h-full w-full"
                >
                  <BlurImage
                    src={song.artwork}
                    alt={song.title}
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                </motion.div>
                {/* Shine overlay */}
                <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -left-1/3 top-0 h-full w-1/3 animate-shine bg-gradient-to-r from-white/10 via-white/60 to-white/10 blur-lg" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-85 transition-opacity duration-200 group-hover:opacity-90" />
                {index === 0 && (
                  <div className="absolute left-3 top-3 z-20 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-lg">
                    Latest
                  </div>
                )}
                <motion.div
                  className="absolute inset-x-0 bottom-0 p-4"
                  variants={titleVariants}
                >
                  <h2 className="text-lg font-bold text-white drop-shadow-md">
                    {song.title}
                  </h2>
                  <p className="text-xs text-white/80">{song.artist}</p>
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-12 md:flex-row md:items-start md:gap-12">
          <div className="w-full md:w-1/2">
            <PressPhotoCarousel />
          </div>
          <Separator orientation="vertical" className="mx-4 hidden md:block" />
          <div className="w-full md:w-1/2">
            {/* About Section readability improved */}
            <section className="my-0">
              <Card className="border-none bg-black/70 shadow-xl backdrop-blur-md">
                <CardHeader className="space-y-3">
                  <CardTitle>
                    <Image
                      src="/icons/maxwellyoung.svg"
                      alt="Maxwell Young Logo"
                      width={160}
                      height={75}
                      style={{ filter: "invert(1) brightness(2)" }}
                      className="ml-0"
                      priority
                    />
                  </CardTitle>
                  <CardDescription className="text-base font-medium tracking-wide text-white/90">
                    Pop because it&apos;s for people. Alternative because it has
                    to be new.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="leading-relaxed tracking-wide text-white/90">
                    Maxwell Young is a New Zealand artist making
                    emotionally-driven alt-pop that&apos;s both personal and
                    unpredictable. He started violin at three, learned
                    production in his teens, and unexpectedly landed early
                    internet traction when his beats appeared in Casey
                    Neistat&apos;s vlogs. Since then, he&apos;s opened for The
                    Internet and Snail Mail, with cosigns from The 1975, Phoebe
                    Bridgers, and Brockhampton.
                  </p>
                  <p className="leading-relaxed tracking-wide text-white/90">
                    His 2022 EP <em className="text-white">Birthday Girl</em>{" "}
                    marked a shift—toward sharper textures, emotional
                    maximalism, and songwriting that feels like recollection
                    more than storytelling.{" "}
                    <em className="text-white">In My 20s</em> (2025) picks up
                    that thread: a record about spirals, near-misses, and
                    becoming who you are while already being someone else. The
                    songs are immediate, catchy, and just off enough to stick
                    with you.
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>

        {selectedSong && (
          <SongDrawer song={selectedSong} open={isOpen} onClose={closeDrawer} />
        )}
      </div>
    </div>
  );
};

export default CollectableGrid;
