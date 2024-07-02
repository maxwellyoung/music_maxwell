import React from "react";
import Image from "next/image";

export default function CtaSection() {
  return (
    <section className="my-12 flex flex-col items-center text-center">
      <h1 className="mb-4 text-4xl font-bold">
        Freewheelin&apos; by Maxwell Young
      </h1>
      <p className="mb-8 text-lg">Out now. Stream everywhere.</p>
      <div className="mb-8 flex items-center justify-center">
        <a
          href="https://music.drm.co.nz/freewheelin"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Image
            src="/artworks/Freewheelin.webp"
            alt="Freewheelin' Artwork"
            width={600}
            height={600}
            className="transform rounded-lg shadow-lg transition-transform group-hover:scale-105"
          />
        </a>
      </div>
      <a
        href="https://music.drm.co.nz/freewheelin"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
      >
        Stream now
      </a>
      <p className="mt-8 text-xl font-light text-gray-400">
        New songs coming soon... Stay tuned for more.
      </p>
      <p className="mt-2 text-sm font-light text-gray-500">
        Magic is everywhere.
      </p>
    </section>
  );
}
