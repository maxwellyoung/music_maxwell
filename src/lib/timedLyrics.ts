export type TimedLyricWord = {
  text: string;
  start: number;
  end: number;
};

export type TimedLyricLine = {
  text: string;
  start: number;
  end: number;
  words: readonly TimedLyricWord[];
};

export type TimedWordFrame = TimedLyricWord & {
  progress: number;
  state: "complete" | "active" | "pending";
};

export type TimedLyricFrame = {
  previous?: TimedLyricLine;
  active?: TimedLyricLine;
  next?: TimedLyricLine;
  words: readonly TimedWordFrame[];
};

export function wordProgress(time: number, word: TimedLyricWord) {
  if (time <= word.start) return 0;
  if (time >= word.end) return 1;
  return (time - word.start) / Math.max(word.end - word.start, 0.01);
}

export function getTimedLyricFrame(
  lines: readonly TimedLyricLine[],
  time: number,
): TimedLyricFrame {
  const activeIndex = lines.findIndex(
    (line) => time >= line.start && time <= line.end,
  );

  if (activeIndex < 0) {
    let previous: TimedLyricLine | undefined;
    for (let index = lines.length - 1; index >= 0; index -= 1) {
      if (lines[index]!.end < time) {
        previous = lines[index];
        break;
      }
    }
    const next = lines.find((line) => line.start > time);
    return { previous, next, words: [] };
  }

  const active = lines[activeIndex]!;
  return {
    previous: lines[activeIndex - 1],
    active,
    next: lines[activeIndex + 1],
    words: active.words.map((word) => {
      const progress = wordProgress(time, word);
      return {
        ...word,
        progress,
        state: progress >= 1 ? "complete" : progress > 0 ? "active" : "pending",
      };
    }),
  };
}
