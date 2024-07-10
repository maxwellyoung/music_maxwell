import React from "react";
import Image from "next/image";

export default function CtaSection() {
  return (
    <section className="my-12 flex flex-col items-center overflow-hidden px-4 text-center">
      <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
        Freewheelin&apos; by <span className="font-reenie">Maxwell Young</span>
      </h1>
      <p className="mb-8 text-base sm:text-lg">Out now. Stream everywhere.</p>
      <div className="mb-8 flex items-center justify-center">
        <div className="w-full max-w-xs transform overflow-hidden rounded-lg shadow-lg">
          <div
            style={{ paddingBottom: "100%", position: "relative" }}
            className="group"
          >
            <Image
              src="/artworks/Freewheelin.webp"
              alt="Freewheelin' Artwork"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="transition-transform group-hover:scale-105"
              priority
            />
          </div>
        </div>
      </div>
      <a
        href="https://music.drm.co.nz/freewheelin"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg bg-[#F02D42] px-4 py-2 text-white transition hover:bg-red-600"
      >
        Stream now
      </a>
      <p className="mt-8 text-base font-light text-gray-400 sm:text-xl">
        New songs coming soon... Stay tuned for more.
      </p>
      <p className="mt-2 text-xs font-light text-gray-500 sm:text-sm">
        Magic is everywhere.
      </p>
    </section>
  );
}
