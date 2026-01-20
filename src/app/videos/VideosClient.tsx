"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import songs from "~/components/songsData";

// Filter songs that have videoLink
const videosData = songs
  .filter((song) => song.videoLink)
  .map((song) => ({
    title: song.title,
    artist: song.artist,
    artwork: song.artwork,
    videoUrl: song.videoLink!,
    youtubeId: extractYouTubeId(song.videoLink!),
  }));

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match?.[2] && match[2].length === 11 ? match[2] : null;
}

function VideoCard({
  video,
  onClick,
}: {
  video: (typeof videosData)[0];
  onClick: () => void;
}) {
  const thumbnailUrl = video.youtubeId
    ? `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`
    : video.artwork;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <Image
          src={thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/30">
            <svg
              className="ml-1 h-8 w-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="font-semibold text-white">{video.title}</h3>
          <p className="text-sm text-white/70">{video.artist}</p>
        </div>
      </div>
    </motion.div>
  );
}

function VideoModal({
  video,
  onClose,
}: {
  video: (typeof videosData)[0];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-2 -top-12 rounded-full p-2 text-white/70 transition-colors hover:text-white"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Video embed */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
          {video.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/60">
              Video unavailable
            </div>
          )}
        </div>

        {/* Video info */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-white">{video.title}</h2>
          <p className="text-white/60">{video.artist}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function VideosClient() {
  const [selectedVideo, setSelectedVideo] = useState<
    (typeof videosData)[0] | null
  >(null);

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Videos
          </h1>
          <p className="text-lg text-white/60">
            Music videos and visual content
          </p>
        </div>

        {/* Video grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videosData.map((video) => (
            <VideoCard
              key={video.title}
              video={video}
              onClick={() => setSelectedVideo(video)}
            />
          ))}
        </div>

        {videosData.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/60">No videos available yet.</p>
          </div>
        )}
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
