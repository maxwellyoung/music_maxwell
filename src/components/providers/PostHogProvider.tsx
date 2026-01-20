"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Analytics helper functions
export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>,
) => {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, properties);
  }
};

export const trackStreamingClick = (
  platform: "spotify" | "apple" | "youtube",
  songTitle: string,
) => {
  trackEvent("streaming_link_clicked", {
    platform,
    song: songTitle,
  });
};

export const trackPresave = (songTitle: string, platform: string) => {
  trackEvent("presave_clicked", {
    song: songTitle,
    platform,
  });
};

export const trackEmailSignup = (source: string) => {
  trackEvent("email_signup", {
    source,
  });
};
