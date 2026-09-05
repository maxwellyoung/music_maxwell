import assert from "node:assert/strict";
import { test } from "node:test";
import {
  element,
  pause,
  play,
  serverState,
  state,
  stop,
  subscribe,
} from "./ledgerPlayer.ts";

class TestAudio extends EventTarget {
  preload = "";
  crossOrigin = "";
  src = "";
  paused = true;
  ended = false;
  currentTime = 0;
  duration = Number.NaN;
  fail = false;
  pending: Promise<void> | null = null;
  play() {
    if (this.fail) return Promise.reject(new Error("Media unavailable"));
    this.paused = false;
    this.ended = false;
    this.dispatchEvent(new Event("play"));
    return this.pending ?? Promise.resolve();
  }
  pause() {
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  }
}

Object.defineProperty(globalThis, "Audio", {
  value: TestAudio,
  configurable: true,
});
Object.defineProperty(globalThis, "window", {
  value: {
    dispatchEvent: () => true,
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => undefined,
  },
  configurable: true,
});

const media = () => element() as unknown as TestAudio;

test("reading or subscribing never creates or starts audio", () => {
  assert.equal(element(), null);
  const unsubscribe = subscribe(() => undefined);
  assert.equal(state(), serverState());
  assert.equal(state().playing, false);
  assert.equal(element(), null);
  unsubscribe();
});

test("a later subscriber sees the current playing source and media time immediately", async () => {
  await play("/one.m4a");
  assert.equal(state().playing, true);
  assert.equal(media().preload, "none");
  const previous = state();
  media().currentTime = 8;
  media().duration = 30;
  media().dispatchEvent(new Event("timeupdate"));
  const unsubscribe = subscribe(() => undefined);
  assert.deepEqual(state(), {
    src: "/one.m4a",
    playing: true,
    time: 8,
    duration: 30,
    error: null,
  });
  assert.equal(previous.time, 0);
  assert.equal(serverState().playing, false);
  unsubscribe();
});

test("pause retains progress; leaving the control stops and resets its source", async () => {
  pause();
  assert.equal(state().playing, false);
  assert.equal(state().time, 8);
  await play("/one.m4a");
  stop("/one.m4a");
  assert.equal(state().playing, false);
  assert.equal(state().time, 0);
});

test("an old control cannot stop a different excerpt", async () => {
  await play("/two.m4a");
  stop("/one.m4a");
  assert.equal(state().src, "/two.m4a");
  assert.equal(state().playing, true);
  stop();
});

test("a play request completing after stop cannot restore the playing state", async () => {
  let finish!: () => void;
  media().pending = new Promise<void>((resolve) => {
    finish = resolve;
  });
  const request = play("/two.m4a");
  stop();
  finish();
  await request;
  assert.equal(state().playing, false);
  media().pending = null;
});

test("ended and rejected playback produce truthful controls with a retryable error", async () => {
  await play("/two.m4a");
  media().ended = true;
  media().dispatchEvent(new Event("ended"));
  assert.equal(state().playing, false);
  media().fail = true;
  await play("/two.m4a");
  assert.equal(state().playing, false);
  assert.match(state().error ?? "", /could not play/);
  media().fail = false;
  await play("/two.m4a");
  assert.equal(state().error, null);
  assert.equal(state().playing, true);
  stop();
});
