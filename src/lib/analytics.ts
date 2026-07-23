"use client";

import { track } from "@vercel/analytics";

export type SiteEvent =
  | "audio_excerpt_started"
  | "audio_excerpt_completed"
  | "release_entered"
  | "archive_item_opened"
  | "streaming_destination_clicked"
  | "film_opened"
  | "release_site_opened";

type EventData = Record<string, string | number | boolean | null>;

export function trackSiteEvent(name: SiteEvent, data: EventData = {}) {
  try {
    track(name, data);
  } catch {
    // Analytics must never interfere with listening or navigation.
  }
}
