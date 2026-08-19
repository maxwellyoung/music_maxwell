"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
// @ts-expect-error: confetti library may not have types
import confetti from "canvas-confetti";

const questions = [
  {
    question: "What is the title of Maxwell Young's debut album?",
    options: ["Daydreamer", "Only Romantics", "Wintour", "Birthday Girl"],
    answer: 0,
    explanation: "Daydreamer is the debut album.",
  },
  {
    question: "Which city was Maxwell born in?",
    options: ["Auckland", "Wellington", "London", "Los Angeles"],
    answer: 1,
    explanation: "Wellington, New Zealand.",
  },
  {
    question: "Which title does not belong in the Maxwell Young archive?",
    options: ["Freewheelin'", "Hopeless", "Videostar", "Purple Rain"],
    answer: 3,
    explanation: "Purple Rain belongs to Prince.",
  },
  {
    question: "Which sound sits closest to the centre of the archive?",
    options: ["Alternative pop", "Heavy metal", "Country", "Classical"],
    answer: 0,
    explanation: "Alternative pop is the nearest fit.",
  },
  {
    question: "Which 2023 single features Thom Haha?",
    options: ["Turn It Up", "Birthday Girl", "Daydreamer", "Hopeless"],
    answer: 0,
    explanation: "Turn It Up is by Maxwell Young & Thom Haha.",
  },
  {
    question: "Which title comes from the 2018 album?",
    options: ["Daydreamer", "Wintour", "Birthday Girl", "Turn It Up"],
    answer: 0,
    explanation: "Daydreamer arrived in 2018.",
  },
  {
    question: "Where can you leave a fragment on this site?",
    options: ["Notes", "The cart", "Artwork", "Credits"],
    answer: 0,
    explanation: "The Notes wall is open for fragments and replies.",
  },
];

export default function MaxwellYoungQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const question = questions[current]!;
  const progress = showResult
    ? 100
    : ((current + (selected === null ? 0 : 1)) / questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.answer) {
      setScore((value) => value + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((value) => value + 1);
      setSelected(null);
      return;
    }

    setShowResult(true);
    if (score === questions.length) {
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#ff789a", "#d9ff5f", "#3157ec", "#ffffff"],
      });
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setSelected(null);
  };

  return (
    <main className="min-h-screen bg-[#11100f] px-5 pb-16 pt-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex items-center justify-between border-b border-white/20 pb-5">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Music
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            Archive test · {questions.length} questions
          </p>
        </div>

        <div className="grid gap-8 py-8 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[0.32fr_0.68fr] lg:items-center lg:gap-20 lg:py-10">
          <aside>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
              How closely
            </p>
            <h1 className="mb-4 mt-3 text-5xl leading-[0.85] tracking-[-0.065em] text-white sm:text-6xl lg:mb-5 lg:mt-4 lg:text-9xl">
              <span className="lg:block">Were</span>{" "}
              <span className="lg:block">you</span>{" "}
              <span className="lg:block">listening?</span>
            </h1>
            <p className="font-reenie text-3xl leading-none text-white/60 lg:text-4xl">
              no peeking at the archive
            </p>
          </aside>

          <section className="min-w-0">
            <div className="mb-9">
              <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                <span>
                  {showResult ? "Finished" : `Question ${current + 1}`}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 overflow-hidden bg-white/15">
                <motion.div
                  className="h-full bg-white"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {showResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-reenie text-5xl leading-none text-white/80">
                    final score
                  </p>
                  <div className="my-7 flex items-end gap-4">
                    <span className="text-[9rem] font-bold leading-[0.72] tracking-[-0.09em] text-white sm:text-[13rem]">
                      {score}
                    </span>
                    <span className="pb-2 text-2xl text-white/35">
                      / {questions.length}
                    </span>
                  </div>
                  <h2 className="mb-4 text-3xl text-white">
                    {score === questions.length
                      ? "No skips. No mistakes."
                      : score >= questions.length - 2
                        ? "You know your way around."
                        : "The archive is waiting."}
                  </h2>
                  <p className="mb-9 max-w-xl text-lg leading-relaxed text-white/55">
                    {score === questions.length
                      ? "A perfect run. You can officially claim the aux."
                      : "Take another run, or head back through the releases and collect the missing pieces."}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Run it back
                    </button>
                    <Link
                      href="/"
                      className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:border-white hover:text-white"
                    >
                      Browse music
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="mb-8 max-w-4xl text-4xl leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl">
                    {question.question}
                  </h2>

                  <div className="border-b border-white/20">
                    {question.options.map((option, index) => {
                      const isCorrect = index === question.answer;
                      const isSelected = index === selected;
                      const answered = selected !== null;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleAnswer(index)}
                          disabled={answered}
                          className={`group grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-4 border-t py-5 text-left transition sm:grid-cols-[3rem_1fr_auto] sm:py-6 ${
                            answered && isCorrect
                              ? "border-[#d9ff5f] text-[#d9ff5f]"
                              : answered && isSelected
                                ? "border-[#ff789a] text-[#ff789a]"
                                : answered
                                  ? "border-white/10 text-white/25"
                                  : "border-white/20 text-white hover:border-[#3157ec] hover:text-[#8fa4ff]"
                          }`}
                        >
                          <span className="font-reenie text-2xl">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-xl font-semibold sm:text-2xl">
                            {option}
                          </span>
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                      );
                    })}
                  </div>

                  {selected !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 flex flex-col gap-6 border-l-2 border-white/40 pl-5 sm:flex-row sm:items-end sm:justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                          {selected === question.answer
                            ? "You got it"
                            : "Not this time"}
                        </p>
                        <p className="mt-2 text-lg text-white/65">
                          {question.explanation}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-white px-6 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
                      >
                        {current + 1 === questions.length
                          ? "See the damage"
                          : "Next one"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
}
