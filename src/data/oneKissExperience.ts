import type { TimedLyricLine } from "../lib/timedLyrics.ts";

export { wordProgress } from "../lib/timedLyrics.ts";

export const oneKissHookDuration = 18;

export const oneKissTimedHook = [
  {
    text: "it’s like this midas",
    start: 0,
    end: 2.1,
    words: [
      { text: "it’s", start: 0, end: 0.66 },
      { text: "like", start: 0.66, end: 0.86 },
      { text: "this", start: 0.86, end: 1.22 },
      { text: "midas", start: 1.22, end: 2.1 },
    ],
  },
  {
    text: "your hips / our lips",
    start: 2.1,
    end: 3.82,
    words: [
      { text: "your", start: 2.1, end: 2.5 },
      { text: "hips", start: 2.5, end: 2.9 },
      { text: "/", start: 2.9, end: 3.18 },
      { text: "our", start: 3.18, end: 3.5 },
      { text: "lips", start: 3.5, end: 3.82 },
    ],
  },
  {
    text: "one kiss",
    start: 4.22,
    end: 4.6,
    words: [
      { text: "one", start: 4.22, end: 4.26 },
      { text: "kiss", start: 4.26, end: 4.6 },
    ],
  },
  {
    text: "i couldn’t wait",
    start: 4.9,
    end: 6.22,
    words: [
      { text: "i", start: 4.9, end: 5.4 },
      { text: "couldn’t", start: 5.4, end: 5.84 },
      { text: "wait", start: 5.84, end: 6.22 },
    ],
  },
  {
    text: "now it’s priceless",
    start: 6.76,
    end: 7.84,
    words: [
      { text: "now", start: 6.76, end: 6.86 },
      { text: "it’s", start: 6.86, end: 7.3 },
      { text: "priceless", start: 7.3, end: 7.84 },
    ],
  },
  {
    text: "smiling stunned since miley",
    start: 8.48,
    end: 10.48,
    words: [
      { text: "smiling", start: 8.48, end: 8.76 },
      { text: "stunned", start: 8.76, end: 9.38 },
      { text: "since", start: 9.38, end: 9.76 },
      { text: "miley", start: 9.76, end: 10.48 },
    ],
  },
  {
    text: "one kiss",
    start: 11.06,
    end: 11.62,
    words: [
      { text: "one", start: 11.06, end: 11.16 },
      { text: "kiss", start: 11.16, end: 11.62 },
    ],
  },
] as const satisfies readonly TimedLyricLine[];

export function lyricLineAt(
  time: number,
  lines: readonly TimedLyricLine[] = oneKissTimedHook,
) {
  return lines.findIndex((line) => time >= line.start && time <= line.end);
}
