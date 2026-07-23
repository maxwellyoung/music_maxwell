"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import type { CarouselApi } from "./ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import songs, { type Song } from "~/data/releases";
import { cn } from "~/lib/utils";
import { ChevronDown, XIcon } from "lucide-react";
import { trackSiteEvent } from "~/lib/analytics";
import { releaseWorldFor, type ReleaseMaterialName } from "~/lib/releaseWorlds";
import { findTimedLyrics } from "~/data/timedLyrics";
import TimedLyricsPlayer from "./TimedLyricsPlayer";

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
  immediate = false,
}: {
  src: string;
  alt: string;
  className?: string;
  immediate?: boolean;
}) => {
  const [isLoading, setLoading] = useState(!immediate);

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
      quality={75}
      className={cn(
        "object-cover transition-[opacity,transform] duration-300 ease-out",
        isLoading
          ? "scale-[1.015] opacity-70"
          : "scale-100 opacity-100",
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
        quality={75}
        className={cn(
          "object-cover transition-[opacity,transform] duration-300 ease-out",
          isLoading
            ? "scale-[1.015] opacity-70"
            : "scale-100 opacity-100",
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
      className="mx-auto w-full"
    >
      <CarouselContent>
        {photos.map((photo) => (
          <CarouselItem key={photo.src} className="basis-full">
            <motion.div
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="group relative aspect-[3/4] w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-foreground/15" />
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
          className="border-foreground/20 bg-foreground text-background transition hover:bg-accent"
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
                "h-1.5 rounded-full transition-colors",
                index === current
                  ? "w-6 bg-foreground"
                  : "w-1.5 bg-foreground/20",
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
          className="border-foreground/20 bg-foreground text-background transition hover:bg-accent"
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

const streamingLinks = (song: Song): StreamingLink[] =>
  [
    song.links.smartLink
      ? {
          label: "All Links",
          shortLabel: "Listen",
          href: song.links.smartLink,
          className: "",
        }
      : null,
    song.links.spotify
      ? {
          label: "Spotify",
          href: song.links.spotify,
          className: "",
        }
      : null,
    song.links.appleMusic
      ? {
          label: "Apple Music",
          shortLabel: "Apple",
          href: song.links.appleMusic,
          className: "",
        }
      : null,
    song.links.youtube
      ? {
          label: "YouTube",
          href: song.links.youtube,
          className: "",
        }
      : null,
    song.links.tidal
      ? {
          label: "Tidal",
          href: song.links.tidal,
          className: "",
        }
      : null,
    song.links.pandora
      ? {
          label: "Pandora",
          href: song.links.pandora,
          className: "",
        }
      : null,
    song.links.soundCloud
      ? {
          label: "SoundCloud",
          href: song.links.soundCloud,
          className: "",
        }
      : null,
    song.links.bandcamp
      ? {
          label: "Bandcamp",
          href: song.links.bandcamp,
          className: "",
        }
      : null,
    song.links.microsite
      ? {
          label: "Release Site",
          shortLabel: "Site",
          href: song.links.microsite,
          className: "",
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
    ...(song.details ?? []),
  ].filter(Boolean) as Array<{ label: string; value: string }>;

const releaseYear = (song: Song) => song.releaseDate?.match(/\d{4}$/)?.[0];

const releaseAnchor = (song: Song) => `release-${song.slug}`;
type SheetPalette = {
  paper: string;
  ink: string;
  accent: string;
  wash: string;
  texture?: ReleaseMaterialName;
};

const sheetPalettes: Record<string, SheetPalette> = {
  "sneakin-drinks-into-bars": {
    paper: "#f2ede4",
    ink: "#171411",
    accent: "#c43762",
    wash: "#eadfce",
  },
  "videostar-cleopatra": {
    paper: "#101015",
    ink: "#f6f0ea",
    accent: "#ef60c8",
    wash: "#1d1823",
  },
};

const neutralSheetPalette: SheetPalette = {
  paper: "#f2ede4",
  ink: "#171411",
  accent: "#3157ec",
  wash: "#e3ddd3",
};

const getSheetPalette = (song: Song) => {
  const world = releaseWorldFor(song.slug);
  return (
    (world
      ? { ...world.material, texture: world.material.texture }
      : undefined) ??
    sheetPalettes[song.slug] ??
    neutralSheetPalette
  );
};

const sheetVariables = (palette: SheetPalette) =>
  ({
    "--sheet-paper": palette.paper,
    "--sheet-ink": palette.ink,
    "--sheet-accent": palette.accent,
    "--sheet-wash": palette.wash,
  }) as CSSProperties;

const StreamingLinks = ({ song }: { song: Song }) => {
  const links = streamingLinks(song);
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex min-h-11 items-center border-b border-current text-sm font-semibold transition hover:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sheet-accent)]",
            link.className,
          )}
          onClick={() => {
            vibrate(3);
            trackSiteEvent("streaming_destination_clicked", {
              release: song.title,
              service: link.label.toLowerCase().replaceAll(" ", "_"),
              location: "archive_drawer",
            });
          }}
          aria-label={link.label}
        >
          {link.label} ↗
        </a>
      ))}
    </div>
  );
};

type AudioFrame = {
  progress: number;
  energy: number;
};

const ArchivePlayer = ({
  song,
  onClose,
  onAudioFrame,
}: {
  song: Song;
  onClose: () => void;
  onAudioFrame: (frame: AudioFrame) => void;
}) => {
  const palette = getSheetPalette(song);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    const canvasContext = canvas.getContext("2d");
    let animationFrame = 0;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let frequencyData: Uint8Array | null = null;

    const progressForAudio = () =>
      Number.isFinite(audio.duration) && audio.duration > 0
        ? Math.min(1, Math.max(0, audio.currentTime / audio.duration))
        : 0;

    const paint = (progress: number, energy: number) => {
      if (!canvasContext) return;
      const bounds = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * scale));
      const height = Math.max(1, Math.round(bounds.height * scale));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      canvasContext.clearRect(0, 0, width, height);
      canvasContext.fillStyle = `${palette.accent}38`;
      canvasContext.fillRect(0, height - scale, width, scale);
      canvasContext.fillStyle = palette.accent;
      canvasContext.fillRect(
        0,
        height - 2 * scale,
        width * progress,
        2 * scale,
      );

      if (!frequencyData || reduceMotion) return;

      const barCount = 28;
      const gap = 2 * scale;
      const barWidth = Math.max(1, (width - gap * (barCount - 1)) / barCount);
      for (let index = 0; index < barCount; index += 1) {
        const frequencyIndex = Math.floor(
          (index / barCount) * frequencyData.length * 0.72,
        );
        const amplitude = (frequencyData[frequencyIndex] ?? 0) / 255;
        const barHeight = Math.max(scale, amplitude * height * 0.82);
        canvasContext.globalAlpha = 0.35 + amplitude * 0.65;
        canvasContext.fillRect(
          index * (barWidth + gap),
          (height - barHeight) / 2,
          barWidth,
          barHeight,
        );
      }
      canvasContext.globalAlpha = 1;

      if (energy === 0) {
        canvasContext.fillRect(0, height / 2, width * progress, scale);
      }
    };

    const readFrame = () => {
      const progress = progressForAudio();
      let energy = 0;

      if (analyser && frequencyData && !reduceMotion) {
        // Typed-array generics differ between the local TS 6 runtime and
        // Vercel's DOM declarations. The Web Audio call is valid in both.
        (analyser.getByteFrequencyData as (data: Uint8Array) => void)(
          frequencyData,
        );
        const total = frequencyData.reduce((sum, value) => sum + value, 0);
        energy = Math.min(1, total / frequencyData.length / 138);
      }

      paint(progress, energy);
      onAudioFrame({ progress, energy });

      if (!audio.paused && !audio.ended) {
        animationFrame = window.requestAnimationFrame(readFrame);
      }
    };

    const ensureAudioGraph = () => {
      if (reduceMotion) return;

      if (audioContext) {
        if (audioContext.state === "suspended") {
          void audioContext.resume().catch(() => undefined);
        }
        return;
      }

      const AudioContextConstructor =
        window.AudioContext ??
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextConstructor) return;

      try {
        audioContext = new AudioContextConstructor();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.76;
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        void audioContext.resume().catch(() => undefined);
      } catch (error) {
        console.info("[ArchivePlayer] Audio analysis unavailable", error);
        analyser = null;
        frequencyData = null;
      }
    };

    const start = () => {
      window.cancelAnimationFrame(animationFrame);
      ensureAudioGraph();
      readFrame();
    };

    const settle = () => {
      window.cancelAnimationFrame(animationFrame);
      const progress = progressForAudio();
      paint(progress, 0);
      onAudioFrame({ progress, energy: 0 });
    };

    const syncWhenIdle = () => {
      if (audio.paused || audio.ended) settle();
    };

    audio.addEventListener("play", start);
    audio.addEventListener("pause", settle);
    audio.addEventListener("ended", settle);
    audio.addEventListener("loadedmetadata", settle);
    audio.addEventListener("timeupdate", syncWhenIdle);
    settle();

    if (!audio.paused) start();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      audio.removeEventListener("play", start);
      audio.removeEventListener("pause", settle);
      audio.removeEventListener("ended", settle);
      audio.removeEventListener("loadedmetadata", settle);
      audio.removeEventListener("timeupdate", syncWhenIdle);
      onAudioFrame({ progress: 0, energy: 0 });
      if (audioContext) void audioContext.close();
    };
  }, [mounted, onAudioFrame, palette.accent, reduceMotion, song.previewUrl]);

  if (!song.previewUrl || !mounted) return null;

  return createPortal(
    <aside
      aria-label={`Now playing ${song.title}`}
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-[100] border-t border-current px-4 py-3 shadow-[0_-18px_45px_rgba(0,0,0,0.18)] sm:bottom-5 sm:left-1/2 sm:right-auto sm:w-[min(760px,calc(100vw-2.5rem))] sm:-translate-x-1/2 sm:border"
      style={{ backgroundColor: palette.paper, color: palette.ink }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="border-current/20 relative h-11 w-11 shrink-0 overflow-hidden border">
          <Image
            src={song.artwork}
            alt=""
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="hidden min-w-0 sm:block sm:w-36">
          <p className="truncate text-sm font-bold leading-tight">
            {song.title}
          </p>
          <p className="mt-1 text-xs opacity-55">excerpt</p>
        </div>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="hidden h-9 w-24 shrink-0 sm:block"
        />
        <audio
          ref={audioRef}
          key={song.previewUrl}
          className="h-10 min-w-0 flex-1"
          controls
          autoPlay
          preload="metadata"
          src={song.previewUrl}
        >
          <a href={song.previewUrl}>Play the {song.title} excerpt</a>
        </audio>
        <button
          type="button"
          onClick={onClose}
          className="border-current/20 grid h-11 w-11 shrink-0 place-items-center border-l transition hover:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label="Close player"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </aside>,
    document.body,
  );
};

const SongSheet = ({
  song,
  open,
  onClose,
  newerSong,
  olderSong,
  onNavigate,
  onPreview,
  reduceMotion,
}: {
  song: Song;
  open: boolean;
  onClose: () => void;
  newerSong?: Song;
  olderSong?: Song;
  onNavigate: (song: Song) => void;
  onPreview: (song: Song) => void;
  reduceMotion: boolean;
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

  const palette = getSheetPalette(song);
  const sheetNumber = songs.findIndex((item) => item.slug === song.slug) + 1;
  const timedLyrics = findTimedLyrics({
    slug: song.slug,
    previewUrl: song.previewUrl,
    lyricVersion: selectedVersion,
  });
  const previewMatchesSelectedLyrics =
    !song.previewLyricVersion || song.previewLyricVersion === selectedVersion;
  const timedLyricsId = `timed-lyrics-${song.slug}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="!left-0 !top-0 !h-[100dvh] !max-w-none !translate-x-0 !translate-y-0 !gap-0 !overflow-hidden !rounded-none !border-0 !bg-transparent !p-0 !shadow-none [&>button]:hidden"
      >
        <div
          className="release-sheet relative isolate h-full overflow-y-auto overscroll-contain bg-[var(--sheet-paper)] text-[var(--sheet-ink)]"
          data-release-material={palette.texture}
          style={sheetVariables(palette)}
        >
          {palette.texture && (
            <div className="release-material-layer" aria-hidden="true" />
          )}
          <header className="border-current/20 sticky top-0 z-30 border-b bg-[color:var(--sheet-paper)]">
            <div className="mx-auto grid min-h-16 max-w-[1280px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:min-h-20 sm:grid-cols-[1fr_auto_1fr] sm:px-8 lg:px-12">
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="text-xs font-semibold tabular-nums opacity-45">
                  {String(sheetNumber).padStart(2, "0")}/
                  {String(songs.length).padStart(2, "0")}
                </span>
                <DialogTitle className="mb-0 truncate text-base font-bold tracking-[-0.03em] !text-[var(--sheet-ink)] sm:text-lg">
                  {song.title}
                </DialogTitle>
              </div>
              <div className="hidden items-center gap-6 sm:flex">
                {newerSong ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(newerSong)}
                    className="min-h-11 text-sm font-semibold transition hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sheet-accent)]"
                  >
                    ← newer
                  </button>
                ) : (
                  <span />
                )}
                {olderSong ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(olderSong)}
                    className="min-h-11 text-sm font-semibold transition hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sheet-accent)]"
                  >
                    older →
                  </button>
                ) : (
                  <span />
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="border-current/20 grid h-11 w-11 place-items-center justify-self-end border-l transition hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sheet-accent)]"
                aria-label="Close song sheet"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </header>

          <article className="relative z-[1] mx-auto max-w-[1280px] px-4 pb-36 pt-8 sm:px-8 sm:pt-12 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <motion.div
                  layoutId={
                    reduceMotion
                      ? undefined
                      : `release-cover-${releaseAnchor(song)}`
                  }
                  transition={{
                    layout: {
                      duration: 0.26,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  className="border-current/25 relative aspect-square overflow-hidden border bg-black"
                >
                  <BlurImage
                    src={song.artwork}
                    alt={`${song.title} artwork`}
                    immediate
                  />
                </motion.div>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold opacity-50">
                  {song.artist}
                </p>
                <p className="font-pixel-line mt-3 text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.78] tracking-[-0.055em]">
                  {song.title}
                </p>

                {releaseFacts(song).length > 0 && (
                  <dl className="border-current/20 bg-current/20 mt-10 grid gap-px border-y sm:grid-cols-2 xl:grid-cols-3">
                    {releaseFacts(song).map((fact) => (
                      <div
                        key={fact.label}
                        className="bg-[var(--sheet-paper)] px-0 py-4 sm:px-4"
                      >
                        <dt className="text-xs font-semibold opacity-45">
                          {fact.label}
                        </dt>
                        <dd className="mt-1 text-base font-bold">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                  {song.previewUrl &&
                    previewMatchesSelectedLyrics &&
                    (timedLyrics ? (
                      <a
                        href={`#${timedLyricsId}`}
                        className="inline-flex min-h-12 items-center gap-3 border border-current px-5 text-sm font-bold transition hover:bg-[var(--sheet-ink)] hover:text-[var(--sheet-paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sheet-accent)]"
                      >
                        <span aria-hidden="true">↓</span> hear with lyrics
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          trackSiteEvent("audio_excerpt_started", {
                            release: song.title,
                            location: "archive_sheet",
                          });
                          onPreview(song);
                        }}
                        className="inline-flex min-h-12 items-center gap-3 border border-current px-5 text-sm font-bold transition hover:bg-[var(--sheet-ink)] hover:text-[var(--sheet-paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sheet-accent)]"
                      >
                        <span aria-hidden="true">▶</span> play excerpt
                      </button>
                    ))}
                  {song.releasePath && (
                    <Link
                      href={song.releasePath}
                      onClick={() =>
                        trackSiteEvent("release_entered", {
                          release: song.title,
                          location: "archive_sheet",
                        })
                      }
                      className="inline-flex min-h-12 items-center border-b border-current text-sm font-bold transition hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sheet-accent)]"
                    >
                      {song.world
                        ? "enter the release room ↗"
                        : "open full artefact ↗"}
                    </Link>
                  )}
                </div>

                {streamingLinks(song).length > 0 && (
                  <section className="border-current/20 mt-12 border-t pt-5">
                    <h3 className="mb-4 text-sm font-bold !text-current">
                      Listen
                    </h3>
                    <StreamingLinks song={song} />
                  </section>
                )}

                {song.videoLink && (
                  <section className="border-current/20 mt-12 border-t pt-5">
                    <h3 className="mb-4 text-sm font-bold !text-current">
                      Film
                    </h3>
                    <a
                      href={song.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-current/25 group relative block w-full overflow-hidden border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sheet-accent)]"
                    >
                      <div className="absolute inset-0 z-10 grid place-items-center bg-black/10 transition group-hover:bg-black/25">
                        <span className="grid h-14 w-14 place-items-center border border-white/60 bg-black/55 text-white transition group-hover:scale-105">
                          ▶
                        </span>
                      </div>
                      <YouTubeThumbnail
                        videoUrl={song.videoLink}
                        alt={`${song.title} film`}
                      />
                    </a>
                  </section>
                )}

                {song.lyrics && (
                  <section className="border-current/20 mt-12 border-t pt-5">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="mb-0 text-2xl font-bold tracking-[-0.03em] !text-current">
                          Lyrics
                        </h3>
                        {getLyrics().includes("[?]") && (
                          <p className="mt-2 text-xs font-medium opacity-50">
                            Transcription incomplete; uncertain words remain
                            marked.
                          </p>
                        )}
                        {!previewMatchesSelectedLyrics &&
                          song.previewLyricVersion && (
                            <p className="mt-2 text-xs font-medium opacity-50">
                              The available excerpt is for{" "}
                              {song.previewLyricVersion}; these lyrics remain
                              static.
                            </p>
                          )}
                      </div>
                      {Object.keys(song.lyrics).length > 1 && (
                        <div className="relative w-full sm:w-64">
                          <select
                            aria-label="Lyrics version"
                            value={selectedVersion}
                            onChange={(event) => {
                              vibrate(3);
                              setSelectedVersion(event.currentTarget.value);
                            }}
                            className="border-current/40 h-11 w-full appearance-none rounded-none border-x-0 border-b border-t-0 bg-transparent px-0 pr-8 text-sm font-semibold text-current shadow-none outline-none focus:border-current focus:ring-0"
                          >
                            {Object.keys(song.lyrics).map((version) => (
                              <option
                                key={version}
                                value={version}
                                style={{
                                  color: palette.ink,
                                  backgroundColor: palette.paper,
                                }}
                              >
                                {version}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            aria-hidden="true"
                            className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
                          />
                        </div>
                      )}
                    </div>
                    {timedLyrics && (
                      <div className="mb-10">
                        <TimedLyricsPlayer
                          id={timedLyricsId}
                          record={timedLyrics}
                          release={selectedVersion}
                        />
                      </div>
                    )}
                    <div className="border-current/15 opacity-78 whitespace-pre-wrap border-y py-7 text-[1.05rem] font-medium leading-[1.75] sm:columns-2 sm:gap-12">
                      {renderTextWithEmbeds(formatText(getLyrics()))}
                    </div>
                  </section>
                )}

                {song.credits && (
                  <section className="border-current/20 mt-12 border-t pt-5">
                    <h3 className="mb-5 text-2xl font-bold tracking-[-0.03em] !text-current">
                      Credits
                    </h3>
                    <div className="whitespace-pre-wrap text-base font-semibold leading-relaxed opacity-65">
                      {renderTextWithEmbeds(formatText(song.credits))}
                    </div>
                  </section>
                )}

                <nav
                  aria-label="Move through the archive"
                  className="border-current/20 mt-14 grid grid-cols-2 border-y sm:hidden"
                >
                  {newerSong ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(newerSong)}
                      className="border-current/20 min-h-14 border-r text-left text-sm font-bold"
                    >
                      ← newer
                    </button>
                  ) : (
                    <span />
                  )}
                  {olderSong ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(olderSong)}
                      className="min-h-14 text-right text-sm font-bold"
                    >
                      older →
                    </button>
                  ) : (
                    <span />
                  )}
                </nav>
              </div>
            </div>
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type CollectableGridProps = {
  showFeaturedHero?: boolean;
  hideFeaturedInGrid?: boolean;
};

const CollectableGrid: React.FC<CollectableGridProps> = ({
  showFeaturedHero = true,
  hideFeaturedInGrid = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activePreview, setActivePreview] = useState<Song | null>(null);
  const [atmosphereSong, setAtmosphereSong] = useState<Song | null>(null);
  const [activeYear, setActiveYear] = useState("all");
  const [error] = useState<string | null>(null);
  const archiveSectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const featuredSong = songs[0] as Song;
  const gridSongs = hideFeaturedInGrid ? songs.slice(1) : songs;
  const archiveYears = Array.from(
    new Set(gridSongs.map(releaseYear).filter(Boolean)),
  ) as string[];
  const visibleSongs =
    activeYear === "all"
      ? gridSongs
      : gridSongs.filter((song) => releaseYear(song) === activeYear);
  const archiveAtmosphereSong = activePreview ?? atmosphereSong;
  const archivePalette = getSheetPalette(archiveAtmosphereSong ?? featuredSong);

  const handleAudioFrame = useCallback(
    ({ progress, energy }: AudioFrame) => {
      const archive = archiveSectionRef.current;
      if (!archive) return;
      archive.style.setProperty("--audio-progress", String(progress));
      archive.style.setProperty(
        "--audio-energy",
        String(reduceMotion ? 0 : energy),
      );
    },
    [reduceMotion],
  );

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

  const openDrawer = (song: Song) => {
    try {
      trackSiteEvent("archive_item_opened", { release: song.title });
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
    <LayoutGroup id="release-archive">
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
              className="mb-10 overflow-hidden border-y border-foreground/10 bg-[#f1eadf]/90 p-4 shadow-sm shadow-foreground/5 sm:p-6 md:mb-14"
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
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openDrawer(featuredSong)}
                  onPointerEnter={() => setAtmosphereSong(featuredSong)}
                  onPointerLeave={() =>
                    setAtmosphereSong((current) =>
                      current?.slug === featuredSong.slug ? null : current,
                    )
                  }
                  onFocus={() => setAtmosphereSong(featuredSong)}
                  onBlur={() =>
                    setAtmosphereSong((current) =>
                      current?.slug === featuredSong.slug ? null : current,
                    )
                  }
                  className="group relative aspect-square overflow-hidden bg-black shadow-xl shadow-accent/10 outline-none transition hover:-rotate-1 hover:scale-[1.015] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                  aria-label={`Open ${featuredSong.title}`}
                >
                  <motion.div
                    layoutId={
                      reduceMotion || !hideFeaturedInGrid
                        ? undefined
                        : `release-cover-${releaseAnchor(featuredSong)}`
                    }
                    transition={{
                      layout: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
                    }}
                    className="absolute inset-0"
                  >
                    <BlurImage
                      src={featuredSong.artwork}
                      alt={featuredSong.title}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </motion.div>
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

          <section
            ref={archiveSectionRef}
            id="archive"
            className="relative isolate scroll-mt-8"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 z-0 overflow-hidden sm:-inset-12"
            >
              <AnimatePresence initial={false}>
                {archiveAtmosphereSong && (
                  <motion.div
                    key={archiveAtmosphereSong.title}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: activePreview ? 0.13 : 0.075,
                      backgroundColor: archivePalette.wash,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.24,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0"
                  />
                )}
              </AnimatePresence>
              {activePreview && (
                <div
                  className="absolute top-1/2 h-[28rem] w-[28rem] rounded-full will-change-transform"
                  style={{
                    left: "calc(var(--audio-progress, 0) * 100%)",
                    background: `radial-gradient(circle, ${archivePalette.accent} 0%, transparent 70%)`,
                    opacity: "calc(0.035 + var(--audio-energy, 0) * 0.17)",
                    transform:
                      "translate(-50%, -50%) scale(calc(0.82 + var(--audio-energy, 0) * 0.32))",
                  }}
                />
              )}
              <div className="absolute inset-x-0 top-0 h-px overflow-hidden bg-foreground/10">
                <div
                  className="h-full w-full origin-left will-change-transform"
                  style={{
                    backgroundColor: archivePalette.accent,
                    transform: "scaleX(var(--audio-progress, 0))",
                  }}
                />
              </div>
            </div>
            <div className="relative z-10 mb-8 grid gap-5 border-b border-foreground/25 pb-6 sm:grid-cols-[1fr_auto] sm:items-end md:mb-12">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.26em] text-accent">
                  01 · Discography
                </p>
                <h2 className="mb-0 text-5xl leading-[0.82] tracking-[-0.055em] sm:text-7xl md:text-8xl">
                  The archive
                </h2>
              </div>
              <p className="text-foreground/58 max-w-sm text-sm tabular-nums sm:text-right">
                {gridSongs.length} releases · {archiveYears.at(-1)}–
                {archiveYears[0]}
              </p>
            </div>

            <nav
              aria-label="Filter releases by year"
              className="release-rail relative z-10 mb-8 flex overflow-x-auto border-y border-foreground/20 sm:mb-11"
            >
              {["all", ...archiveYears].map((year) => {
                const isActive = activeYear === year;
                const count =
                  year === "all"
                    ? gridSongs.length
                    : gridSongs.filter((song) => releaseYear(song) === year)
                        .length;

                return (
                  <button
                    key={year}
                    type="button"
                    aria-pressed={isActive}
                    aria-controls="release-grid"
                    onClick={() => {
                      vibrate(3);
                      setAtmosphereSong(null);
                      setActiveYear(year);
                    }}
                    className={cn(
                      "flex min-h-12 min-w-24 shrink-0 items-center justify-between gap-5 border-r border-foreground/20 px-4 text-sm font-bold tabular-nums transition-[min-width,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                      isActive
                        ? "min-w-36 bg-foreground text-background"
                        : "text-foreground/55 hover:bg-foreground hover:text-background",
                    )}
                  >
                    <span>{year}</span>
                    <span className="text-[10px] opacity-55">{count}</span>
                  </button>
                );
              })}
            </nav>

            <motion.div
              id="release-grid"
              layout
              aria-live="polite"
              className="relative z-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-11 lg:grid-cols-4"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {visibleSongs.map((song, index) => {
                  const archiveIndex = gridSongs.findIndex(
                    (release) => release.slug === song.slug,
                  );
                  const isFiltered = activeYear !== "all";
                  const isSolo = isFiltered && visibleSongs.length === 1;
                  const isPair = isFiltered && visibleSongs.length === 2;
                  const isLead =
                    (!isFiltered && index === 0) ||
                    (isFiltered && visibleSongs.length === 3 && index === 0);
                  const isWide = !isFiltered && (index === 5 || index === 11);
                  const isPortrait = !isFiltered && index === 8;

                  return (
                    <motion.button
                      key={song.title}
                      layout
                      initial={{ opacity: 0, scale: 0.985 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.985 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      id={releaseAnchor(song)}
                      type="button"
                      onClick={() => openDrawer(song)}
                      onPointerEnter={() => setAtmosphereSong(song)}
                      onPointerLeave={() =>
                        setAtmosphereSong((current) =>
                          current?.slug === song.slug ? null : current,
                        )
                      }
                      onFocus={() => setAtmosphereSong(song)}
                      onBlur={() =>
                        setAtmosphereSong((current) =>
                          current?.slug === song.slug ? null : current,
                        )
                      }
                      className={cn(
                        "group cursor-pointer scroll-mt-24 text-left focus:outline-none",
                        isLead && "col-span-2 lg:col-span-2 lg:row-span-2",
                        isWide && "col-span-2 lg:col-span-2",
                        isPortrait && "lg:row-span-2",
                        isPair && "col-span-2 lg:col-span-2",
                        isSolo && "col-span-2 lg:col-span-2 lg:col-start-2",
                      )}
                    >
                      <div
                        className={cn(
                          "relative overflow-hidden bg-black transition duration-500 ease-out group-hover:-rotate-[0.6deg] group-hover:scale-[1.01] group-focus-visible:ring-4 group-focus-visible:ring-[#3157ec]",
                          isWide
                            ? "aspect-[2/1]"
                            : isPortrait
                              ? "aspect-[3/4]"
                              : "aspect-square",
                        )}
                      >
                        <motion.div
                          layoutId={
                            reduceMotion
                              ? undefined
                              : `release-cover-${releaseAnchor(song)}`
                          }
                          variants={albumVariants}
                          initial="initial"
                          whileHover="hover"
                          transition={{
                            layout: {
                              duration: 0.26,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          }}
                          className="relative h-full w-full"
                        >
                          <BlurImage
                            src={song.artwork}
                            alt={song.title}
                            className="transition-transform duration-700 group-hover:scale-[1.035]"
                          />
                        </motion.div>
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/15" />
                        {song.world && song.releasePath ? (
                          <span className="absolute bottom-3 right-3 border-t border-white/55 bg-black/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                            world ↗
                          </span>
                        ) : (
                          <span className="absolute right-3 top-3 grid h-8 w-8 translate-y-2 place-items-center border border-white/30 bg-black/65 text-[10px] font-bold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            ↗
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex gap-3 border-t border-foreground/20 pt-2 sm:mt-4">
                        <span className="text-[10px] font-bold tracking-[0.12em] text-foreground/45">
                          {String(
                            archiveIndex + (hideFeaturedInGrid ? 2 : 1),
                          ).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3
                            className={cn(
                              "mb-0 text-base leading-[1.05] tracking-[-0.035em] sm:text-xl",
                              isLead && "text-2xl sm:text-4xl",
                            )}
                          >
                            {song.title}
                          </h3>
                          <p className="mt-1 text-[11px] font-semibold text-foreground/45">
                            {song.releaseDate}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </section>

          <section className="mt-24 grid gap-10 border-t border-foreground/25 pt-7 md:mt-36 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-accent">
                02 · Maxwell
              </p>
            </div>
            <div className="md:col-span-5">
              <PressPhotoCarousel />
            </div>
            <div className="flex flex-col justify-between md:col-span-5 md:pl-6">
              <div>
                <p className="font-reenie mb-8 text-4xl leading-[0.9] text-foreground/65 sm:text-5xl">
                  Pop because it&apos;s for people. Alternative because it has
                  to be new.
                </p>
                <div className="text-foreground/68 max-w-xl space-y-5 text-base leading-relaxed sm:text-lg">
                  <p>
                    Maxwell Young is a New Zealand artist making emotionally
                    driven alt-pop that feels personal, immediate and slightly
                    unpredictable.
                  </p>
                  <p>
                    He started violin at three, learned production in his teens,
                    and later opened for The Internet and Snail Mail. The songs
                    move between sharp pop instinct and recollection: bright
                    enough to catch, strange enough to stay.
                  </p>
                </div>
              </div>
              <p className="mt-10 border-t border-foreground/20 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                Wellington / Tāmaki Makaurau / wherever the song goes
              </p>
            </div>
          </section>

          {selectedSong &&
            (() => {
              const selectedIndex = songs.findIndex(
                (song) => song.slug === selectedSong.slug,
              );
              return (
                <SongSheet
                  song={selectedSong}
                  open={isOpen}
                  onClose={closeDrawer}
                  newerSong={
                    selectedIndex > 0 ? songs[selectedIndex - 1] : undefined
                  }
                  olderSong={
                    selectedIndex >= 0 && selectedIndex < songs.length - 1
                      ? songs[selectedIndex + 1]
                      : undefined
                  }
                  onNavigate={(song) => {
                    vibrate(3);
                    trackSiteEvent("archive_item_opened", {
                      release: song.title,
                      method: "sheet_navigation",
                    });
                    setSelectedSong(song);
                  }}
                  onPreview={setActivePreview}
                  reduceMotion={reduceMotion ?? false}
                />
              );
            })()}
        </div>
        {activePreview && (
          <ArchivePlayer
            key={activePreview.title}
            song={activePreview}
            onAudioFrame={handleAudioFrame}
            onClose={() => {
              setActivePreview(null);
              handleAudioFrame({ progress: 0, energy: 0 });
            }}
          />
        )}
      </div>
    </LayoutGroup>
  );
};

export default CollectableGrid;
