"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { RefreshCw, Play, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { oneKissPublicMedia } from "~/data/releaseMedia";
import { trackSiteEvent } from "~/lib/analytics";

const films = oneKissPublicMedia.films;

export default function CampaignReel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const completedRef = useRef<string | null>(null);
  const activeFilm = films[selectedIndex]!;

  const shuffle = () => {
    setSelectedIndex((current) => {
      const offset = Math.floor(Math.random() * (films.length - 1)) + 1;
      return (current + offset) % films.length;
    });
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(18rem,0.42fr)] lg:items-end lg:gap-14">
        <div className="order-2 lg:order-1">
          <p
            aria-live="polite"
            className="font-pixel-line min-h-[3.5em] max-w-[15ch] text-3xl uppercase leading-[0.9] text-white/80 sm:text-5xl"
          >
            {activeFilm.line}
          </p>

          <div className="mt-8 border-y border-white/20">
            {films.map((film, index) => (
              <button
                key={film.id}
                type="button"
                aria-pressed={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
                onFocus={() => setSelectedIndex(index)}
                className="font-pixel-dot group flex min-h-12 w-full items-center gap-4 border-b border-white/15 text-left text-[11px] uppercase tracking-[0.1em] text-white/45 transition last:border-b-0 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8ea6ff] data-[selected=true]:text-white"
                data-selected={selectedIndex === index}
              >
                <span className="w-6 tabular-nums text-[#8ea6ff]">
                  0{index + 1}
                </span>
                <span>{film.label}</span>
                <span
                  className={`ml-auto h-px transition-all ${selectedIndex === index ? "w-12 bg-[#8ea6ff]" : "w-5 bg-white/25 group-hover:w-8"}`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={shuffle}
            className="font-pixel-dot mt-5 inline-flex min-h-11 items-center gap-3 text-[10px] uppercase tracking-[0.1em] text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ea6ff]"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            scramble the signal
          </button>
        </div>

        <Dialog.Trigger asChild>
          <button
            type="button"
            onClick={() => {
              completedRef.current = null;
              setIsOpen(true);
              trackSiteEvent("campaign_film_opened", {
                release: "1kiss",
                film_id: activeFilm.id,
              });
            }}
            className="group relative order-1 mx-auto aspect-[9/16] w-full max-w-[22rem] overflow-hidden border border-white/20 bg-[#05070c] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ea6ff] lg:order-2"
            aria-label={`Play ${activeFilm.label}, 18 seconds`}
          >
            <Image
              key={activeFilm.id}
              src={`/1kiss/films/${activeFilm.stem}.webp`}
              alt=""
              fill
              sizes="(min-width: 1024px) 22rem, 90vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02] group-hover:opacity-80"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
            <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center border border-white/60 bg-black/35 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-black">
              <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-pixel-dot absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-[10px] uppercase tracking-[0.1em] text-white">
              <span>0{selectedIndex + 1} / {activeFilm.label}</span>
              <span className="tabular-nums text-white/65">00:18</span>
            </span>
          </button>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] max-h-[92vh] w-[min(92vw,31rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-white/20 bg-black shadow-2xl focus:outline-none">
          <Dialog.Title className="sr-only">
            {activeFilm.label}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            An 18-second vertical campaign film with music.
          </Dialog.Description>
          <video
            key={activeFilm.id}
            src={`/1kiss/films/${activeFilm.stem}.mp4`}
            poster={`/1kiss/films/${activeFilm.stem}.webp`}
            className="max-h-[92vh] w-full bg-black object-contain"
            controls
            autoPlay
            playsInline
            preload="none"
            onEnded={() => {
              if (completedRef.current === activeFilm.id) return;
              completedRef.current = activeFilm.id;
              trackSiteEvent("campaign_film_completed", {
                release: "1kiss",
                film_id: activeFilm.id,
              });
            }}
          />
          <Dialog.Close className="absolute right-3 top-3 grid h-11 w-11 place-items-center border border-white/40 bg-black/65 text-white backdrop-blur-sm transition hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close film</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
