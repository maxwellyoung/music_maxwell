import { oneKissTimedHook } from "./oneKissExperience.ts";
import type { TimedLyricLine } from "../lib/timedLyrics.ts";

type WordTuple = readonly [text: string, start: number, end: number];

export type TimedLyricsRecord = {
  slug: string;
  previewUrl: string;
  lyricVersion: string;
  duration: number;
  lines: readonly TimedLyricLine[];
  evidence: {
    method: "word-aligned-transcription";
    alignedOn: string;
  };
};

function linesFromWordTuples(groups: readonly (readonly WordTuple[])[]) {
  return groups.map((group) => ({
    text: group.map(([text]) => text).join(" "),
    start: group[0]?.[1] ?? 0,
    end: group.at(-1)?.[2] ?? 0,
    words: group.map(([text, start, end]) => ({ text, start, end })),
  })) satisfies TimedLyricLine[];
}

const alignedLyrics = {
  "sneakin-drinks-into-bars": linesFromWordTuples([
    [
      ["sneakin", 8.38, 9.08],
      ["drinks", 9.08, 9.4],
      ["into", 9.4, 9.76],
      ["bars", 9.76, 10.8],
    ],
    [
      ["sensing", 10.8, 13.24],
      ["it'll", 13.24, 14.02],
      ["fall", 14.02, 14.08],
      ["apart", 14.533, 14.639],
    ],
    [
      ["we're", 16.808, 17.143],
      ["fluent", 17.7, 17.76],
      ["in", 17.7, 18.02],
      ["false", 18.02, 18.28],
      ["alarms", 18.28, 19.44],
    ],
    [
      ["we", 19.44, 20.96],
      ["make", 20.96, 21.26],
      ["it", 21.26, 21.62],
      ["up", 21.62, 21.86],
      ["as", 21.86, 22.14],
      ["we", 22.14, 22.38],
      ["go", 22.38, 22.72],
      ["along", 22.72, 22.91],
    ],
    [
      ["from", 24.71, 25.86],
      ["molehills", 25.86, 26.46],
      ["we", 26.46, 26.66],
      ["drew", 26.66, 27],
      ["a", 27, 27.46],
      ["map", 27.46, 27.8],
    ],
  ]),
  flying: linesFromWordTuples([
    [
      ["girl", 0.63, 1.18],
      ["you're", 1.18, 1.54],
      ["the", 1.54, 1.6],
      ["number", 1.56, 1.72],
      ["one", 1.72, 2.1],
      ["i", 2.1, 2.28],
      ["really", 2.28, 2.54],
      ["wanna", 2.54, 2.88],
      ["know", 2.88, 3.418],
    ],
    [
      ["one", 3.74, 4.16],
      ["glass", 4.16, 4.34],
      ["of", 4.34, 4.54],
      ["red", 4.54, 4.72],
      ["while", 4.72, 4.84],
      ["getting", 4.84, 5.2],
      ["dressed", 5.2, 5.48],
    ],
    [
      ["and", 5.48, 5.7],
      ["then", 5.7, 5.88],
      ["we'd", 5.88, 6.06],
      ["go", 6.06, 6.48],
    ],
    [
      ["you", 6.62, 7.18],
      ["know", 7.18, 7.38],
      ["i", 7.38, 7.62],
      ["really", 7.62, 7.84],
      ["wanna", 7.84, 8.2],
      ["say", 8.2, 8.58],
      ["it", 8.58, 8.72],
      ["but", 8.72, 8.96],
      ["i", 8.96, 9.44],
      ["won't", 9.44, 9.61],
    ],
    [
      ["you", 10.12, 10.2],
      ["get", 10.2, 10.44],
      ["me", 10.44, 10.58],
      ["shy", 10.58, 10.8],
    ],
    [
      ["so", 10.8, 11.02],
      ["i", 11.02, 11.24],
      ["just", 11.24, 11.38],
      ["left", 11.38, 11.62],
      ["you", 11.62, 11.82],
      ["with", 11.82, 12],
      ["a", 12, 12.18],
      ["note", 12.18, 12.82],
    ],
    [
      ["whenever", 12.82, 13.4],
      ["you", 13.4, 13.76],
      ["pop", 13.88, 14.1],
      ["up", 14.1, 14.28],
      ["in", 14.28, 14.46],
      ["front", 14.46, 14.64],
      ["put", 14.64, 14.84],
      ["down", 14.84, 15.06],
      ["my", 15.06, 15.24],
      ["phone", 15.36, 15.72],
    ],
    [
      ["can't", 15.72, 16.42],
      ["keep", 16.42, 16.56],
      ["my", 16.56, 16.78],
      ["eyes", 16.78, 16.98],
      ["off", 16.98, 17.14],
      ["you", 17.14, 17.36],
    ],
    [
      ["i", 17.36, 17.54],
      ["wish", 17.54, 17.74],
      ["we", 17.74, 17.92],
      ["were", 17.92, 18.14],
      ["alone", 18.3, 18.42],
    ],
    [
      ["rather", 18.78, 19.42],
      ["than", 19.42, 19.8],
      ["at", 19.8, 19.86],
      ["this", 19.8, 19.86],
      ["matinee", 19.8, 19.935],
      ["for", 20.34, 20.54],
      ["reasons", 20.54, 20.84],
      ["i", 20.84, 21.22],
      ["don’t", 21.22, 21.36],
      ["know", 21.51, 21.622],
    ],
    [
      ["were", 21.96, 22.46],
      ["walking", 22.5, 22.88],
      ["out", 22.88, 23.1],
      ["the", 23.1, 23.46],
      ["door", 23.46, 23.52],
      ["but", 23.48, 23.72],
      ["then", 23.72, 23.84],
      ["they", 23.84, 23.98],
      ["played", 23.98, 24.2],
      ["your", 24.2, 24.42],
      ["song", 24.42, 24.555],
    ],
    [["sometimes", 26.959, 27.08]],
  ]),
  wintour: linesFromWordTuples([
    [
      ["i", 0.38, 0.44],
      ["feel", 0.495, 0.84],
      ["like", 0.84, 1.12],
      ["britney", 1.12, 1.48],
      ["spears", 1.48, 1.78],
      ["caus", 1.78, 1.98],
      ["i'm", 1.98, 2.28],
      ["always", 2.38, 2.72],
      ["misunderstood", 2.72, 3.286],
    ],
    [
      ["take", 3.625, 4.18],
      ["me", 4.18, 4.42],
      ["lucky", 4.42, 5],
      ["take", 5.14, 5.2],
      ["me", 5.14, 5.34],
      ["toxic", 5.34, 5.7],
    ],
    [
      ["let", 5.7, 6.1],
      ["me", 6.1, 6.34],
      ["jump", 6.34, 6.62],
      ["inside", 6.62, 7.06],
      ["ur", 7.06, 7.32],
      ["pool", 7.32, 7.58],
    ],
    [
      ["i'm", 8.045, 8.2],
      ["on", 8.2, 8.28],
      ["demon", 8.28, 8.76],
      ["there's", 8.96, 9.02],
      ["no", 9, 9.22],
      ["reason", 9.22, 9.52],
      ["why", 9.64, 10],
      ["i'm", 10, 10.26],
      ["acting", 10.26, 10.6],
      ["such", 10.6, 10.9],
      ["a", 10.9, 11.18],
      ["fool", 11.18, 11.42],
    ],
    [
      ["gets", 11.42, 11.88],
      ["outrageous", 11.88, 12.4],
      ["on", 12.525, 12.896],
      ["occasion", 13.02, 13.38],
      ["i", 13.38, 13.82],
      ["make", 13.82, 13.96],
      ["anybody", 14.155, 14.74],
      ["cool", 14.74, 15.28],
    ],
    [
      ["fuck", 15.28, 15.76],
      ["a", 15.76, 15.98],
      ["slut", 15.98, 16.18],
      ["shame", 16.18, 16.44],
      ["fuck", 16.7, 16.76],
      ["the", 16.7, 17],
      ["gossip", 17, 17.24],
    ],
    [
      ["clean", 17.24, 17.66],
      ["ur", 17.66, 17.84],
      ["shit", 17.84, 18.08],
      ["shut", 18.08, 18.38],
      ["up", 18.38, 18.6],
      ["and", 18.6, 18.86],
      ["mop", 18.86, 19.14],
      ["it", 19.14, 19.36],
    ],
    [
      ["there's", 19.36, 19.62],
      ["one", 19.62, 19.8],
      ["thing", 19.8, 20.04],
      ["i'm", 20.04, 20.36],
      ["never", 20.36, 20.66],
      ["stopping", 20.66, 21.1],
    ],
    [
      ["find", 21.1, 21.46],
      ["myself", 21.46, 21.9],
      ["a", 21.9, 22.26],
      ["worthy", 22.26, 22.58],
      ["option", 22.74, 23.1],
    ],
    [
      ["run", 23.22, 23.88],
      ["these", 23.88, 24.12],
      ["streets", 24.12, 24.32],
    ],
    [
      ["i", 24.32, 24.64],
      ["run", 24.64, 24.84],
      ["ur", 24.84, 25.1],
      ["mind", 25.1, 25.34],
    ],
    [
      ["i", 25.34, 25.6],
      ["tell", 25.6, 25.84],
      ["you", 25.84, 26.08],
      ["why", 26.08, 26.52],
      ["i", 26.62, 26.68],
      ["never", 26.62, 26.82],
      ["lie", 26.82, 27.28],
    ],
    [
      ["i", 27.28, 27.54],
      ["don't", 27.54, 27.8],
      ["know", 27.8, 27.98],
      ["why", 27.98, 28.26],
      ["u", 28.26, 28.46],
      ["make", 28.46, 28.76],
      ["it", 28.76, 28.94],
      ["feel", 28.94, 29.16],
      ["like", 29.16, 29.44],
      ["that", 29.44, 29.552],
    ],
  ]),
  "call-ur-name-go-ahead": linesFromWordTuples([
    [
      ["Guess", 6.56, 6.68],
      ["what", 6.82, 6.925],
    ],
    [
      ["I", 7.24, 9.78],
      ["think", 9.78, 10],
      ["you're", 10.1, 10.4],
      ["wicked", 10.4, 10.72],
    ],
    [
      ["You've", 10.72, 13.32],
      ["got", 13.32, 13.46],
      ["me", 13.46, 13.62],
      ["singing", 13.62, 13.98],
      ["something", 13.98, 14.34],
      ["special", 14.34, 14.72],
      ["for", 14.72, 15.18],
      ["ya", 15.18, 15.4],
      ["girl", 15.4, 15.738],
    ],
    [
      ["You", 15.85, 16.18],
      ["know", 16.18, 16.42],
      ["I", 16.42, 16.66],
      ["won't", 16.66, 16.81],
      ["forget", 17.26, 17.32],
      ["it", 17.26, 17.385],
    ],
    [
      ["And", 18.26, 20],
      ["guess", 20, 20.36],
      ["what", 20.758, 20.924],
    ],
    [
      ["Girl", 21.42, 22.245],
      ["I", 23.44, 23.5],
      ["think", 23.44, 23.6],
      ["you're", 23.6, 23.735],
      ["wicked", 26.88, 26.94],
    ],
    [
      ["Running", 26.88, 27.6],
      ["back", 27.6, 27.92],
      ["the", 27.92, 28.1],
      ["page", 28.1, 28.54],
      ["just", 28.54, 28.78],
      ["to", 28.78, 29],
      ["say", 29, 29.2],
      ["this", 29.2, 29.42],
    ],
  ]),
} as const;

const timedLyrics = [
  {
    slug: "1kiss",
    previewUrl: "/1kiss/1kiss-hook.m4a",
    lyricVersion: "1kiss",
    duration: 18,
    lines: oneKissTimedHook,
    evidence: {
      method: "word-aligned-transcription",
      alignedOn: "2026-07-23",
    },
  },
  {
    slug: "sneakin-drinks-into-bars",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3a/e2/79/3ae279a5-1016-1804-1729-f4905275faaf/mzaf_18029532613621274581.plus.aac.p.m4a",
    lyricVersion: "Sneakin Drinks Into Bars",
    duration: 30,
    lines: alignedLyrics["sneakin-drinks-into-bars"],
    evidence: {
      method: "word-aligned-transcription",
      alignedOn: "2026-07-23",
    },
  },
  {
    slug: "flying",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0b/52/db/0b52db97-778c-8c81-cf35-a73cf777a19f/mzaf_13680584974187256804.plus.aac.p.m4a",
    lyricVersion: "Flying",
    duration: 30,
    lines: alignedLyrics.flying,
    evidence: {
      method: "word-aligned-transcription",
      alignedOn: "2026-07-23",
    },
  },
  {
    slug: "wintour",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1b/e8/c4/1be8c4b6-2892-ac13-0ce8-478f3a564b8e/mzaf_4067427662252438402.plus.aac.p.m4a",
    lyricVersion: "Wintour",
    duration: 30.022,
    lines: alignedLyrics.wintour,
    evidence: {
      method: "word-aligned-transcription",
      alignedOn: "2026-07-23",
    },
  },
  {
    slug: "call-ur-name-go-ahead",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/d3/da/be/d3dabedc-d792-25a6-9e1f-967715e14a6c/mzaf_6177786969676094496.plus.aac.p.m4a",
    lyricVersion: "Call Ur Name",
    duration: 30,
    lines: alignedLyrics["call-ur-name-go-ahead"],
    evidence: {
      method: "word-aligned-transcription",
      alignedOn: "2026-07-23",
    },
  },
] as const satisfies readonly TimedLyricsRecord[];

export const timedLyricsStaticAudit = [
  {
    slug: "turn-it-up",
    reason: "word-boundary confidence below publication threshold",
  },
  {
    slug: "freewheelin",
    reason: "preview alignment covers only one repeated phrase",
  },
  {
    slug: "i-just-wanna-fly",
    reason: "sustained vocal boundaries remain ambiguous",
  },
  {
    slug: "hopeless",
    reason: "preview alignment is incomplete after the opening phrase",
  },
  {
    slug: "videostar-cleopatra",
    reason: "repeated chorus boundaries remain ambiguous",
  },
] as const;

export function findTimedLyrics({
  slug,
  previewUrl,
  lyricVersion,
}: {
  slug: string;
  previewUrl?: string;
  lyricVersion: string;
}) {
  return timedLyrics.find(
    (entry) =>
      entry.slug === slug &&
      entry.previewUrl === previewUrl &&
      entry.lyricVersion === lyricVersion,
  );
}

export function validateTimedLyricsRecord(record: TimedLyricsRecord) {
  const issues: string[] = [];
  let previousLineStart = -1;

  record.lines.forEach((line, lineIndex) => {
    if (line.start < previousLineStart) {
      issues.push(`${record.slug}:line-${lineIndex}:out-of-order`);
    }
    if (line.start < 0 || line.end < line.start || line.end > record.duration) {
      issues.push(`${record.slug}:line-${lineIndex}:outside-preview`);
    }

    line.words.forEach((word, wordIndex) => {
      if (
        word.start < 0 ||
        word.end < word.start ||
        word.end > record.duration
      ) {
        issues.push(
          `${record.slug}:line-${lineIndex}:word-${wordIndex}:outside-preview`,
        );
      }
    });

    previousLineStart = line.start;
  });

  return issues;
}

export default timedLyrics;
