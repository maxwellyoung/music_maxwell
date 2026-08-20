"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { questions, sources, type Question } from "./quiz-data";
import {
  achievements,
  answer,
  identity,
  initialGame,
  modeSize,
  selectQuestions,
  type Game,
  type Mode,
} from "./quiz-engine";

const modeCopy: Record<Mode, [string, string]> = {
  quick: ["Quick 10", "Ten shuffled cuts. Three lives."],
  deep: ["Deep Cut", "Harder notes from the archive."],
  full: ["Full Discography", "The whole public-source stack."],
};

type Miss = { question: Question; picked: number };

type Kept = { achievements: string[]; bestStreak: number; bestScore: number };

const KEPT_KEY = "maxwell-quiz-kept";

function loadKept(): Kept {
  try {
    const raw = JSON.parse(localStorage.getItem(KEPT_KEY) ?? "{}") as Partial<Kept>;
    return {
      achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
      bestStreak: typeof raw.bestStreak === "number" ? raw.bestStreak : 0,
      bestScore: typeof raw.bestScore === "number" ? raw.bestScore : 0,
    };
  } catch {
    return { achievements: [], bestStreak: 0, bestScore: 0 };
  }
}

export default function QuizClient() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [run, setRun] = useState<Question[]>([]);
  const [at, setAt] = useState(0);
  const [game, setGame] = useState<Game>(initialGame);
  const [picked, setPicked] = useState<number | null>(null);
  const [risk, setRisk] = useState(false);
  const [bestStreakThisRun, setBestStreakThisRun] = useState(0);
  const [misses, setMisses] = useState<Miss[]>([]);
  const [kept, setKept] = useState<Kept>(loadKept);
  const [copied, setCopied] = useState(false);
  const advanceRef = useRef<HTMLButtonElement>(null);

  // The picked option becomes disabled, which would drop keyboard focus on
  // the body; hand it to the advance button instead.
  useEffect(() => {
    if (picked !== null) advanceRef.current?.focus();
  }, [picked]);

  const q = run[at];
  const source = useMemo(
    () => sources.find((s) => s.id === q?.sourceId),
    [q],
  );
  const done = Boolean(mode && (at >= run.length || game.lives === 0));

  function start(m: Mode) {
    setMode(m);
    setRun(selectQuestions(questions, m));
    setAt(0);
    setGame(initialGame);
    setPicked(null);
    setRisk(false);
    setMisses([]);
    setBestStreakThisRun(0);
    setCopied(false);
  }

  function choose(i: number) {
    if (picked !== null || !q) return;
    setPicked(i);
    const correct = i === q.answer;
    if (!correct) setMisses((m) => [...m, { question: q, picked: i }]);
    setGame((g) => {
      const nextGame = answer(g, correct, q.difficulty, risk);
      setBestStreakThisRun((best) => Math.max(best, nextGame.streak));
      return nextGame;
    });
  }

  function next() {
    const isLast = at + 1 >= run.length || game.lives === 0;
    if (isLast) {
      const merged: Kept = {
        achievements: [...new Set([...kept.achievements, ...achievements(game)])],
        bestStreak: Math.max(kept.bestStreak, bestStreakThisRun),
        bestScore: Math.max(kept.bestScore, game.score),
      };
      setKept(merged);
      localStorage.setItem(KEPT_KEY, JSON.stringify(merged));
      setAt(run.length);
    } else {
      setAt((x) => x + 1);
      setPicked(null);
      setRisk(false);
    }
  }

  // Keyboard: 1-4 or A-D answer, Enter advances after an answer.
  useEffect(() => {
    if (!mode || done) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }
      if (picked !== null && event.key === "Enter") {
        event.preventDefault();
        next();
        return;
      }
      const byNumber = ["1", "2", "3", "4"].indexOf(event.key);
      const byLetter = ["a", "b", "c", "d"].indexOf(event.key.toLowerCase());
      const index = byNumber >= 0 ? byNumber : byLetter;
      if (index >= 0) {
        event.preventDefault();
        choose(index);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, done, picked, at, run, risk]);

  /* ── Start screen ─────────────────────────────────────────────── */
  if (!mode) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-5 pb-24 pt-10 sm:px-8 lg:px-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-foreground/45">
          Listening room · public notes
        </p>
        <h1 className="mb-0 mt-4 max-w-3xl text-6xl leading-[0.84] tracking-tighter sm:text-8xl">
          Were you listening?
        </h1>
        <p className="font-reenie mt-6 max-w-xl text-3xl leading-none text-foreground/60 sm:text-4xl">
          {questions.length} sourced questions, shuffled like a mixtape.
        </p>

        <div className="mt-12 border-t border-foreground/25">
          {(Object.keys(modeCopy) as Mode[]).map((m, index) => (
            <button
              key={m}
              onClick={() => start(m)}
              className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-foreground/15 py-6 text-left transition hover:border-foreground/40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground sm:grid-cols-[4rem_16rem_1fr_auto] sm:gap-8"
            >
              <span className="text-xs font-bold tracking-[0.16em] text-foreground/35">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-3xl font-bold leading-none tracking-[-0.035em] transition group-hover:translate-x-1 sm:text-4xl">
                {modeCopy[m][0]}
              </span>
              <span className="hidden text-sm text-foreground/55 sm:block">
                {modeCopy[m][1]}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/40">
                {Math.min(modeSize[m], questions.length)} Qs ↗
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs leading-relaxed text-foreground/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            No account, leaderboard or tracking. Every answer opens its public
            source. Keys 1–4 answer, Enter advances.
          </p>
          {(kept.bestScore > 0 || kept.bestStreak > 0) && (
            <p className="shrink-0 font-bold uppercase tracking-[0.14em]">
              Best on this device: {kept.bestScore} pts · streak{" "}
              {kept.bestStreak}
            </p>
          )}
        </div>
      </main>
    );
  }

  /* ── Result screen ────────────────────────────────────────────── */
  if (done) {
    const pct = game.answered
      ? Math.round((game.correct / game.answered) * 100)
      : 0;
    const title = identity(pct);
    const share = `I got ${game.correct}/${game.answered} on the Maxwell Young ${modeCopy[mode][0]} quiz: ${title}. maxwellyoung.info/quiz`;
    const byCategory = run.slice(0, game.answered).reduce(
      (acc, question) => {
        const missed = misses.some((m) => m.question.id === question.id);
        const entry = acc.get(question.category) ?? { right: 0, total: 0 };
        entry.total += 1;
        if (!missed) entry.right += 1;
        acc.set(question.category, entry);
        return acc;
      },
      new Map<string, { right: number; total: number }>(),
    );

    return (
      <main className="mx-auto w-full max-w-[1440px] px-5 pb-24 pt-10 sm:px-8 lg:px-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-foreground/45">
          Playback complete · {modeCopy[mode][0]}
        </p>
        <h1 className="mb-0 mt-4 text-6xl leading-[0.84] tracking-tighter sm:text-8xl">
          {title}
        </h1>
        <p className="font-reenie mt-5 text-4xl leading-none text-foreground/60">
          {game.correct}/{game.answered} correct · {game.score} points · best
          streak {bestStreakThisRun}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => start(mode)}
            className="rounded-full bg-foreground px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-background transition hover:bg-foreground/85"
          >
            Play another mix
          </button>
          <button
            onClick={() => {
              void navigator.clipboard.writeText(share);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }}
            className="rounded-full border border-foreground/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] transition hover:border-foreground/50"
          >
            {copied ? "Copied" : "Copy result"}
          </button>
          <button
            onClick={() => setMode(null)}
            className="rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-foreground/55 transition hover:text-foreground"
          >
            Change mode
          </button>
        </div>

        {byCategory.size > 0 && (
          <section className="mt-14 border-t border-foreground/25 pt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-foreground/45">
              By category
            </p>
            <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...byCategory.entries()].map(([category, { right, total }]) => (
                <div
                  key={category}
                  className="flex items-baseline justify-between border-b border-foreground/10 pb-2"
                >
                  <span className="text-sm font-semibold">{category}</span>
                  <span className="text-sm tabular-nums text-foreground/55">
                    {right}/{total}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {misses.length > 0 && (
          <section className="mt-14 border-t border-foreground/25 pt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-foreground/45">
              Worth a relisten
            </p>
            <div className="mt-4 space-y-6">
              {misses.map(({ question, picked: pickedIndex }) => {
                const missSource = sources.find(
                  (s) => s.id === question.sourceId,
                );
                return (
                  <div
                    key={question.id}
                    className="border-b border-foreground/10 pb-6"
                  >
                    <p className="text-lg font-bold leading-snug">
                      {question.prompt}
                    </p>
                    <p className="mt-2 text-sm text-foreground/65">
                      You said{" "}
                      <span className="line-through decoration-foreground/40">
                        {question.options[pickedIndex]}
                      </span>{" "}
                      — it&apos;s{" "}
                      <span className="font-bold">
                        {question.options[question.answer]}
                      </span>
                      . {question.explanation}
                    </p>
                    {missSource && (
                      <Link
                        href={missSource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-bold uppercase tracking-[0.14em] text-foreground/50 underline decoration-foreground/25 underline-offset-4 transition hover:text-foreground"
                      >
                        Source: {missSource.title}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {kept.achievements.length > 0 && (
          <p className="mt-12 text-xs font-bold uppercase tracking-[0.18em] text-foreground/40">
            Kept on this device: {kept.achievements.join(" · ")}
          </p>
        )}
      </main>
    );
  }

  /* ── Question screen ──────────────────────────────────────────── */
  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 pb-24 pt-10 sm:px-8 lg:px-12">
      <div className="flex items-baseline justify-between border-b border-foreground/25 pb-4 text-xs font-bold uppercase tracking-[0.16em] text-foreground/45">
        <span>
          {q?.category} · {"●".repeat(q?.difficulty ?? 1)}
          {"○".repeat(3 - (q?.difficulty ?? 1))}
        </span>
        <span className="tabular-nums">
          {at + 1} / {run.length}
        </span>
      </div>
      <div
        className="h-px bg-foreground transition-all duration-500"
        style={{ width: `${(at / run.length) * 100}%` }}
        aria-hidden="true"
      />

      <div className="mt-6 flex items-center justify-between text-sm text-foreground/50">
        <span className="tabular-nums">
          {game.score} pts · streak {game.streak}
        </span>
        <span aria-label={`${game.lives} of 3 lives remaining`}>
          {"♥".repeat(game.lives)}
          {"♡".repeat(3 - game.lives)}
        </span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          {q?.artwork && (
            <div className="relative mb-7 aspect-square w-full max-w-md overflow-hidden bg-black">
              <Image
                src={q.artwork}
                alt="Release artwork — name the release"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
            </div>
          )}
          <h1 className="mb-0 text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl">
            {q?.prompt}
          </h1>
        </div>

        <div>
          <div className="grid gap-3">
            {q?.options.map((option, i) => {
              const state =
                picked === null
                  ? "hover:border-foreground/50"
                  : i === q.answer
                    ? "border-foreground bg-foreground text-background"
                    : i === picked
                      ? "border-foreground/40 line-through opacity-70"
                      : "opacity-40";
              return (
                <button
                  key={option}
                  disabled={picked !== null}
                  onClick={() => choose(i)}
                  className={`flex items-baseline gap-4 border border-foreground/20 px-5 py-4 text-left text-base font-semibold transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground ${state}`}
                >
                  <span className="text-xs font-bold opacity-40">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {picked === null && (
            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-foreground/55">
              <input
                type="checkbox"
                checked={risk}
                onChange={(e) => setRisk(e.target.checked)}
                className="h-4 w-4"
              />
              Double points, but lose two lives on a miss
            </label>
          )}

          {picked !== null && (
            <div
              className="mt-7 border-t border-foreground/15 pt-5"
              role="status"
            >
              <p className="font-reenie text-3xl">
                {picked === q?.answer ? "That is the one." : "Needle slipped."}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                {q?.explanation}
              </p>
              {source && (
                <Link
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.14em] text-foreground/50 underline decoration-foreground/25 underline-offset-4 transition hover:text-foreground"
                >
                  Read source: {source.title}
                </Link>
              )}
              <button
                ref={advanceRef}
                onClick={next}
                className="mt-6 block w-full rounded-full bg-foreground px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-background transition hover:bg-foreground/85"
              >
                {at + 1 === run.length || game.lives === 0
                  ? "Hear the result"
                  : "Next track"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
