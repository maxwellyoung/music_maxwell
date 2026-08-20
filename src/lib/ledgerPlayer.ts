"use client";

// One audio voice for the whole ledger. Whatever asks to play silences
// whatever was playing; the analyser feeds ledger:audio-level so the
// tower and bloom always follow the current sound.
let audio: HTMLAudioElement | null = null;
let analyser: AnalyserNode | null = null;
let meterFrame = 0;
let currentSrc: string | null = null;

const emit = (level: number) =>
  window.dispatchEvent(new CustomEvent("ledger:audio-level", { detail: level }));

const emitState = () =>
  window.dispatchEvent(
    new CustomEvent("ledger:player", {
      detail: { src: currentSrc, playing: !!audio && !audio.paused },
    }),
  );

function ensure() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = "none";
  // Cross-origin previews feed a MediaElementSourceNode; without CORS
  // mode Chromium routes silence through the analyser. Apple's preview
  // CDN sends Access-Control-Allow-Origin: * (verified 2026-08-20).
  audio.crossOrigin = "anonymous";
  audio.addEventListener("ended", () => {
    emit(0);
    emitState();
  });
  audio.addEventListener("pause", () => {
    emit(0);
    emitState();
  });
  return audio;
}

function startMeter() {
  const element = audio;
  if (!element) return;
  if (!analyser) {
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      const context = new Ctor();
      const source = context.createMediaElementSource(element);
      analyser = context.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(context.destination);
    } catch {
      return; // metering is decoration; playback never depends on it
    }
  }
  const data = new Uint8Array(analyser.fftSize);
  const tick = () => {
    if (!analyser || !audio) return;
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (const value of data) {
      const centered = (value - 128) / 128;
      sum += centered * centered;
    }
    emit(Math.min(1, Math.sqrt(sum / data.length) * 3));
    if (!audio.paused && !audio.ended) {
      meterFrame = window.requestAnimationFrame(tick);
    } else {
      emit(0);
    }
  };
  window.cancelAnimationFrame(meterFrame);
  meterFrame = window.requestAnimationFrame(tick);
}

export async function play(src: string) {
  const element = ensure();
  if (currentSrc !== src) {
    element.src = src;
    currentSrc = src;
  }
  try {
    await element.play();
    emitState();
    startMeter();
  } catch {
    // no user activation yet — stay silent
  }
}

export function pause() {
  audio?.pause();
}

export function stop(src?: string) {
  if (src && currentSrc !== src) return;
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

export function state() {
  return {
    src: currentSrc,
    playing: !!audio && !audio.paused,
    time: audio?.currentTime ?? 0,
    duration: audio?.duration || null,
  };
}

export function element() {
  return audio;
}
