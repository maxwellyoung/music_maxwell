export const siteConfig = {
  featuredReleaseSlug: "1kiss",
  featuredHero: {
    background: "/1kiss/signal-field-v2.webp",
    still: "/1kiss/still-hook.jpg",
    excerpt: "/1kiss/1kiss-hook.m4a",
    excerptSeconds: 18,
    standbyLine: "your hips / our lips / one kiss",
    cues: [
      { at: 0, line: "it's like this midas" },
      { at: 2.1, line: "your hips / our lips" },
      { at: 4.22, line: "one kiss" },
      { at: 4.9, line: "i couldn't wait" },
      { at: 6.76, line: "now it's priceless" },
      { at: 8.48, line: "smiling stunned since miley" },
      { at: 11.06, line: "one kiss" },
    ],
  },
} as const;
