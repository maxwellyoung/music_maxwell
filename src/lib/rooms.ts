// Decay and session utilities for Listening Rooms

export type DecayState = "visible" | "fading" | "archived";

export function getDecayState(track: {
  isArchived: boolean;
  decayStartAt: Date | null;
}): DecayState {
  if (track.isArchived) return "archived";
  if (!track.decayStartAt) return "visible";

  const now = new Date();
  const decayStart = new Date(track.decayStartAt);
  const daysSinceDecay =
    (now.getTime() - decayStart.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceDecay >= 30) return "archived";
  if (daysSinceDecay > 0) return "fading";
  return "visible";
}

export function getUnlockTimeRequired(track: {
  isArchived: boolean;
  duration: number;
}): number {
  // Archived tracks require 80% of track duration in listen time to unlock
  if (track.isArchived) {
    return Math.floor(track.duration * 0.8);
  }
  return 0;
}

export function isTrackUnlocked(
  track: { isArchived: boolean; duration: number },
  listenedSeconds: number
): boolean {
  const required = getUnlockTimeRequired(track);
  return required === 0 || listenedSeconds >= required;
}

// Pseudonym generation
const adjectives = [
  "Quiet",
  "Distant",
  "Gentle",
  "Still",
  "Slow",
  "Wandering",
  "Soft",
  "Late",
  "Early",
  "Deep",
];

const nouns = [
  "Listener",
  "Observer",
  "Wanderer",
  "Visitor",
  "Ghost",
  "Voice",
  "Soul",
  "Shadow",
  "Echo",
  "Wave",
];

export function generatePseudonym(sessionCount: number): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun} #${sessionCount + 1}`;
}
