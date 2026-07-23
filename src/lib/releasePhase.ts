export type ReleasePhase = "upcoming" | "release_day" | "released";

export const ONE_KISS_RELEASE_DATE = "2026-07-24";

function localDateKey(now: Date, timeZone?: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    ...(timeZone ? { timeZone } : {}),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function getReleasePhase(
  releaseDate: string,
  now = new Date(),
  timeZone?: string,
): ReleasePhase {
  const today = localDateKey(now, timeZone);
  if (today < releaseDate) return "upcoming";
  if (today === releaseDate) return "release_day";
  return "released";
}
