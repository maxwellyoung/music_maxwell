"use client";

import { useRef } from "react";
import { trackSiteEvent } from "~/lib/analytics";

type ReleaseAudioProps = {
  src: string;
  release: string;
};

export default function ReleaseAudio({ src, release }: ReleaseAudioProps) {
  const started = useRef(false);
  const completed = useRef(false);

  return (
    <audio
      src={src}
      controls
      preload="none"
      className="h-12 w-full"
      onPlay={() => {
        if (started.current) return;
        started.current = true;
        trackSiteEvent("audio_excerpt_started", {
          release,
          location: "release_room",
        });
      }}
      onEnded={() => {
        if (completed.current) return;
        completed.current = true;
        trackSiteEvent("audio_excerpt_completed", {
          release,
          location: "release_room",
        });
      }}
    >
      <a href={src}>Play the {release} excerpt</a>
    </audio>
  );
}
