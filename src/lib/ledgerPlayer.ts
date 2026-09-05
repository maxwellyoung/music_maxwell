"use client";

// One voice, started only by an explicit play control. Snapshots let newly
// mounted controls observe the current state without waiting for an event.
export type PlayerState = {
  src: string | null;
  playing: boolean;
  time: number;
  duration: number | null;
  error: string | null;
};
const initialState: PlayerState = {
  src: null,
  playing: false,
  time: 0,
  duration: null,
  error: null,
};
let snapshot = initialState;
let audio: HTMLAudioElement | null = null;
let context: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let meterFrame = 0;
let generation = 0;
const listeners = new Set<() => void>();

const emitLevel = (level: number) =>
  window.dispatchEvent(
    new CustomEvent("ledger:audio-level", { detail: level }),
  );
function update(patch: Partial<PlayerState> = {}) {
  const next = {
    ...snapshot,
    playing: !!audio && !audio.paused && !audio.ended,
    time: audio?.currentTime ?? 0,
    duration: audio && Number.isFinite(audio.duration) ? audio.duration : null,
    ...patch,
  };
  if (
    Object.keys(next).every(
      (key) =>
        next[key as keyof PlayerState] === snapshot[key as keyof PlayerState],
    )
  )
    return;
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function endMeter() {
  window.cancelAnimationFrame(meterFrame);
  meterFrame = 0;
  emitLevel(0);
}

function ensure() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = "none";
  audio.crossOrigin = "anonymous";
  for (const event of [
    "timeupdate",
    "durationchange",
    "loadedmetadata",
    "play",
    "seeking",
    "seeked",
  ]) {
    audio.addEventListener(event, () => update());
  }
  for (const event of ["pause", "ended"]) {
    audio.addEventListener(event, () => {
      endMeter();
      update();
    });
  }
  audio.addEventListener("error", () => {
    endMeter();
    update({
      playing: false,
      error: "This excerpt could not load. Try again or use a listening link.",
    });
  });
  return audio;
}

function startMeter(element: HTMLAudioElement) {
  try {
    if (!context) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      context = new Ctor();
      analyser = context.createAnalyser();
      analyser.fftSize = 256;
      context.createMediaElementSource(element).connect(analyser);
      analyser.connect(context.destination);
    }
    if (context.state === "suspended")
      void context.resume().catch(() => undefined);
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    const tick = () => {
      if (!analyser || element.paused || element.ended) {
        endMeter();
        return;
      }
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const value of data) sum += ((value - 128) / 128) ** 2;
      emitLevel(Math.min(1, Math.sqrt(sum / data.length) * 3));
      meterFrame = window.requestAnimationFrame(tick);
    };
    window.cancelAnimationFrame(meterFrame);
    meterFrame = window.requestAnimationFrame(tick);
  } catch {
    // The visual meter is optional; an unsupported audio graph must not
    // turn a successful play action into a UI error.
  }
}

export async function play(src: string) {
  const element = ensure();
  const request = ++generation;
  if (snapshot.src !== src) {
    element.pause();
    element.src = src;
    update({ src, time: 0, duration: null, error: null });
  } else update({ error: null });
  try {
    // Resume the graph while the click still supplies user activation.
    startMeter(element);
    await element.play();
    if (request !== generation) return;
    update();
    startMeter(element);
  } catch {
    if (request !== generation) return;
    endMeter();
    update({
      playing: false,
      error: "This excerpt could not play. Try again or use a listening link.",
    });
  }
}

export function pause() {
  generation++;
  audio?.pause();
  endMeter();
  update();
}

export function stop(src?: string) {
  if (src && snapshot.src !== src) return;
  pause();
  if (audio) audio.currentTime = 0;
  update({ time: 0 });
}

export const state = () => snapshot;
export const serverState = () => initialState;
export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export const element = () => audio;
