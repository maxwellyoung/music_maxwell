"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import songs from "./songsData";
import { sanityClient } from "../lib/sanity";
import { cn } from "~/lib/utils";
import { XIcon } from "lucide-react";
import Footer from "./Footer";

// Define the Song type
type Song = {
  title: string;
  artist: string;
  artwork: string;
  links: {
    spotify: string;
    appleMusic: string;
    youtube: string;
  };
  lyrics?: Record<string, string>;
  credits?: string;
  videoLink?: string;
};

// Define the SanityProduct type
type SanityProduct = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  images?: Array<{
    asset: {
      url: string;
      altText?: string;
    };
  }>;
  shopifyProductId?: string;
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
  const match = url.match(regExp);
  const id = match?.[2];

  return id && id.length === 11 ? id : null;
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
        <AnimatePresence mode="wait">
          {photos.map((photo, index) => (
            <CarouselItem key={index} className="basis-full">
              <motion.div
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0.5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden rounded-lg"
              >
                <div className="relative aspect-[3/4] w-full">
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
        </AnimatePresence>
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

const AboutSection = () => (
  <section className="my-12">
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="font-reenie text-4xl">Maxwell Young</span>
        </CardTitle>
        <CardDescription>
          Pop because it&apos;s for people. Alternative because it has to be
          new.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Maxwell Young is a New Zealand artist making emotionally-driven
          alt-pop that&apos;s both personal and unpredictable. He started violin
          at three, learned production in his teens, and unexpectedly landed
          early internet traction when his beats appeared in Casey
          Neistat&apos;s vlogs. Since then, he&apos;s opened for The Internet
          and Snail Mail, with cosigns from The 1975, Phoebe Bridgers, and
          Brockhampton.
        </p>
        <br />
        <p>
          His 2022 EP <em>Birthday Girl</em> marked a shift—toward sharper
          textures, emotional maximalism, and songwriting that feels like
          recollection more than storytelling. <em>In My 20s</em> (2025) picks
          up that thread: a record about spirals, near-misses, and becoming who
          you are while already being someone else. The songs are immediate,
          catchy, and just off enough to stick with you.
        </p>
      </CardContent>
    </Card>
  </section>
);

// Add haptic feedback utility
const vibrate = (pattern: number | number[]) => {
  if (typeof window !== "undefined" && "navigator" in window) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      console.warn("Vibration API not supported");
    }
  }
};

const drawerVariants = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: {
      type: "tween",
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1], // Smooth ease-in-out
    },
  },
  exit: {
    y: "100%",
    transition: {
      type: "tween",
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
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

const SongDrawer = ({
  song,
  open,
  onClose,
}: {
  song: Song;
  open: boolean;
  onClose: () => void;
}) => {
  const [defaultLyricVersion] = useState(song.lyrics?.[0] || song.title);

  useEffect(() => {
    if (open) {
      vibrate(3);
    }
  }, [open]);

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
    if (Object.keys(song.lyrics).length === 1 && song.lyrics[song.title]) {
      return song.lyrics[song.title] ?? "";
    }
    return song.lyrics[defaultLyricVersion] ?? "";
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
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
                <h2 className="text-lg font-medium text-white sm:text-xl">
                  {song.title}
                </h2>
                <DrawerClose className="rounded-lg p-2 text-white/50 transition-colors hover:text-white/75">
                  <XIcon className="h-5 w-5" />
                </DrawerClose>
              </div>

              {/* Mobile streaming links */}
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 md:hidden">
                <a
                  href={song.links.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954]/10 text-[#1DB954] transition-colors hover:bg-[#1DB954]/20"
                  onClick={() => vibrate(3)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </a>
                <a
                  href={song.links.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FB233B]/10 text-[#FB233B] transition-colors hover:bg-[#FB233B]/20"
                  onClick={() => vibrate(3)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 361 361"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M254.5 55c-.87.08-8.6 1.45-9.53 1.64l-107 21.59-.04.01c-2.79.59-4.98 1.58-6.67 3-2.04 1.71-3.17 4.13-3.6 6.95-.09.6-.24 1.82-.24 3.62v133.92c0 3.13-.25 6.17-2.37 8.76-2.12 2.59-4.74 3.37-7.81 3.99l-6.99 1.41c-8.84 1.78-14.59 2.99-19.8 5.01-4.98 1.93-8.71 4.39-11.68 7.51-5.89 6.17-8.28 14.54-7.46 22.38.7 6.69 3.71 13.09 8.88 17.82 3.49 3.2 7.85 5.63 12.99 6.66 5.33 1.07 11.01.7 19.31-.98 4.42-.89 8.56-2.28 12.5-4.61 3.9-2.3 7.24-5.37 9.85-9.11 2.62-3.75 4.31-7.92 5.24-12.35.96-4.57 1.19-8.7 1.19-13.26V64.46c0-6.16-3.25-9.96-9.04-9.46z"
                    />
                  </svg>
                </a>
                <a
                  href={song.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF0000]/10 text-[#FF0000] transition-colors hover:bg-[#FF0000]/20"
                  onClick={() => vibrate(3)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
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
                  className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg md:sticky md:top-6 md:self-start"
                >
                  <BlurImage src={song.artwork} alt={song.title} />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col space-y-4 sm:space-y-6"
                >
                  {/* Desktop streaming links */}
                  <div className="hidden space-y-4 md:block">
                    <h3 className="text-base font-medium text-white sm:text-lg">
                      Listen Now
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={song.links.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-[#1DB954]/10 px-4 py-2 text-[#1DB954] transition-colors hover:bg-[#1DB954]/20"
                        onClick={() => vibrate(3)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                        <span className="text-sm font-medium">Spotify</span>
                      </a>
                      <a
                        href={song.links.appleMusic}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-[#FB233B]/10 px-4 py-2 text-[#FB233B] transition-colors hover:bg-[#FB233B]/20"
                        onClick={() => vibrate(3)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 361 361"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M254.5 55c-.87.08-8.6 1.45-9.53 1.64l-107 21.59-.04.01c-2.79.59-4.98 1.58-6.67 3-2.04 1.71-3.17 4.13-3.6 6.95-.09.6-.24 1.82-.24 3.62v133.92c0 3.13-.25 6.17-2.37 8.76-2.12 2.59-4.74 3.37-7.81 3.99l-6.99 1.41c-8.84 1.78-14.59 2.99-19.8 5.01-4.98 1.93-8.71 4.39-11.68 7.51-5.89 6.17-8.28 14.54-7.46 22.38.7 6.69 3.71 13.09 8.88 17.82 3.49 3.2 7.85 5.63 12.99 6.66 5.33 1.07 11.01.7 19.31-.98 4.42-.89 8.56-2.28 12.5-4.61 3.9-2.3 7.24-5.37 9.85-9.11 2.62-3.75 4.31-7.92 5.24-12.35.96-4.57 1.19-8.7 1.19-13.26V64.46c0-6.16-3.25-9.96-9.04-9.46z"
                          />
                        </svg>
                        <span className="text-sm font-medium">Apple Music</span>
                      </a>
                      <a
                        href={song.links.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-[#FF0000]/10 px-4 py-2 text-[#FF0000] transition-colors hover:bg-[#FF0000]/20"
                        onClick={() => vibrate(3)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span className="text-sm font-medium">YouTube</span>
                      </a>
                    </div>
                  </div>

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
                            value={defaultLyricVersion}
                            onValueChange={(value) => {
                              vibrate(3);
                              // This is a placeholder implementation. You might want to implement a proper state update
                            }}
                          >
                            <SelectTrigger className="w-full border-zinc-800 bg-zinc-900/50 text-white">
                              <SelectValue placeholder="Select a song" />
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
                            {Object.keys(song.lyrics).length > 1 &&
                            !defaultLyricVersion ? (
                              <span className="text-zinc-500">
                                Select a song to view lyrics
                              </span>
                            ) : (
                              formatText(getLyrics())
                            )}
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
                            {formatText(song.credits)}
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

const CollectableGrid: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    initial: { opacity: 0, y: 10 },
    hover: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const sanityProducts: SanityProduct[] = await sanityClient.fetch(
          `*[_type == "product"]{
            _id,
            title,
            description,
            price,
            images[]{
              asset->{
                url,
                altText
              }
            },
            shopifyProductId
          }`,
        );
        setProducts(sanityProducts);
      } catch (error) {
        // Just log the error, don't show it in UI since products are optional
        console.error("[Sanity] Products not available yet:", error);
        setProducts([]);
      }
    };

    void fetchProducts();
  }, []);

  const openDrawer = (song: Song) => {
    try {
      setSelectedSong(song);
      setIsOpen(true);
      console.log("[Drawer] Opening with song:", song.title);
    } catch (error) {
      console.error("[CollectableGrid] Error opening drawer:", error);
    }
  };

  const closeDrawer = () => {
    try {
      setIsOpen(false);
      setTimeout(() => setSelectedSong(null), 300); // Clear song after animation
      console.log("[Drawer] Closing");
    } catch (error) {
      console.error("[CollectableGrid] Error closing drawer:", error);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="bg-dark text-white">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-24">
          {error && error !== "NO_PRODUCTS" && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-red-500">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 md:grid-cols-3 lg:grid-cols-4">
            {songs.map((song, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileHover="hover"
                onClick={() => openDrawer(song)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <motion.div variants={albumVariants}>
                    <BlurImage
                      src={song.artwork}
                      alt={song.title}
                      className="transition-all duration-300 group-hover:scale-105"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <motion.div
                    className="absolute inset-x-0 bottom-0 p-4"
                    variants={titleVariants}
                  >
                    <h2 className="text-base font-medium text-white drop-shadow-md">
                      {song.title}
                    </h2>
                    <p className="text-xs text-white/80">{song.artist}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 flex flex-col items-stretch gap-12 md:flex-row">
            <div className="md:w-1/2">
              <PressPhotoCarousel />
            </div>
            <Separator
              orientation="vertical"
              className="mx-4 hidden md:block"
            />
            <div className="md:w-1/2">
              <AboutSection />
            </div>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Card key={product._id}>
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.description && <p>{product.description}</p>}
                    {product.images?.[0]?.asset?.url && (
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <BlurImage
                          src={product.images[0].asset.url}
                          alt={
                            product.images[0].asset.altText ?? "Product Image"
                          }
                          className="object-cover"
                        />
                      </div>
                    )}
                    {product.price && <p>Price: ${product.price.toFixed(2)}</p>}
                  </CardContent>
                  {product.shopifyProductId && (
                    <CardFooter>
                      <a
                        href={`https://your-shopify-domain.com/products/${product.shopifyProductId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-400 hover:text-zinc-300"
                      >
                        View Product
                      </a>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {selectedSong && (
            <SongDrawer
              song={selectedSong}
              open={isOpen}
              onClose={closeDrawer}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CollectableGrid;
