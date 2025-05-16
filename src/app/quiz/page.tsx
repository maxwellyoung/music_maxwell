"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
// @ts-expect-error: confetti library may not have types
import confetti from "canvas-confetti";

const questions = [
  {
    question: "What is the title of Maxwell Young's debut album?",
    options: ["Daydreamer", "Only Romantics", "Wintour", "Birthday Girl"],
    answer: 0,
    explanation: "Maxwell Young's debut album is 'Daydreamer'.",
  },
  {
    question: "Which city was Maxwell Young born in?",
    options: ["Auckland", "Wellington", "London", "Los Angeles"],
    answer: 1,
    explanation: "Maxwell Young was born in Wellington, New Zealand.",
  },
  {
    question: "Which of these is NOT a Maxwell Young song?",
    options: ["Freewheelin'", "Hopeless", "Videostar", "Purple Rain"],
    answer: 3,
    explanation: "'Purple Rain' is a classic by Prince, not Maxwell Young!",
  },
  {
    question: "Which genre best describes Maxwell Young's music?",
    options: ["Alternative Pop", "Heavy Metal", "Country", "Classical"],
    answer: 0,
    explanation: "Maxwell Young is known for his alternative pop sound.",
  },
  {
    question:
      "What is the name of Maxwell Young's 2023 single featuring Thom Haha?",
    options: ["Turn It Up", "Birthday Girl", "Daydreamer", "Hopeless"],
    answer: 0,
    explanation: "'Turn It Up' is a 2023 single by Maxwell Young & Thom Haha.",
  },
  {
    question: "Which of these is a recurring theme in Maxwell Young's lyrics?",
    options: ["Love & longing", "Space travel", "Cooking", "Sports"],
    answer: 0,
    explanation:
      "Love, longing, and introspection are common themes in Maxwell's lyrics.",
  },
  {
    question:
      "Which platform does Maxwell Young use to share behind-the-scenes and updates?",
    options: ["Instagram", "Reddit", "MySpace", "Pinterest"],
    answer: 0,
    explanation:
      "Instagram (@maxwell_young) is where Maxwell shares updates and BTS content.",
  },
];

const funFacts = [
  "🎤 Maxwell once played a show in a laundromat!",
  "🌏 His music has been streamed in over 50 countries.",
  "🎬 Maxwell directs many of his own music videos.",
  "🎹 He started making music at age 13.",
  "🦋 The song 'No Social Butterfly' is a fan favorite.",
  "🎧 Maxwell loves experimenting with vintage synths.",
  "📸 He often collaborates with visual artists for his covers.",
];

export default function MaxwellYoungQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [factIdx, setFactIdx] = useState(() =>
    Math.floor(Math.random() * funFacts.length),
  );

  const handleAnswer = (idx: number) => {
    if (selected !== null) return; // Prevent double answer
    setSelected(idx);
    setShowFeedback(true);
    if (idx === questions[current]?.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    setFactIdx(Math.floor(Math.random() * funFacts.length));
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      setShowResult(true);
      setTimeout(() => {
        if (
          score + (selected === questions[current]?.answer ? 1 : 0) ===
          questions.length
        ) {
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
        }
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setSelected(null);
    setShowFeedback(false);
    setFactIdx(Math.floor(Math.random() * funFacts.length));
  };

  const progress = ((current + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-xl">
        <Card className="bg-background/80 shadow-2xl backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">
              Maxwell Young Quiz
            </CardTitle>
            <div className="mt-4 h-2 w-full rounded bg-muted">
              <div
                className="h-2 rounded bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {showResult ? (
              <div className="space-y-6 text-center">
                <div className="text-2xl font-semibold">
                  You scored {score} out of {questions.length}!{" "}
                  {score === questions.length
                    ? "🏆"
                    : score >= questions.length - 2
                      ? "👏"
                      : "🎶"}
                </div>
                <div className="mt-2 text-lg">
                  {score === questions.length
                    ? "🎉 Perfect! You're a true Maxwell Young superfan!"
                    : score >= questions.length - 2
                      ? "Great job! You know your Maxwell Young."
                      : "Keep listening and try again!"}
                </div>
                <Button onClick={handleRestart} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mb-4 text-lg font-medium">
                  Question {current + 1} of {questions.length}
                </div>
                <div className="mb-6 text-xl font-semibold">
                  {questions[current]?.question}
                </div>
                <div className="grid gap-4">
                  {questions[current]?.options?.map((opt, idx) => (
                    <Button
                      key={opt}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-base transition-all ${
                        selected !== null
                          ? idx === questions[current]?.answer
                            ? "border-green-500 bg-green-50 text-green-900"
                            : idx === selected
                              ? "border-red-500 bg-red-50 text-red-900"
                              : "opacity-60"
                          : ""
                      }`}
                      variant="outline"
                      disabled={selected !== null}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
                {showFeedback && selected !== null && (
                  <div
                    className={`mt-6 rounded-lg p-4 text-center text-lg font-medium transition-all ${
                      selected === questions[current]?.answer
                        ? "bg-green-100 text-green-900"
                        : "bg-red-100 text-red-900"
                    }`}
                  >
                    {selected === questions[current]?.answer
                      ? "✅ Correct! "
                      : "❌ Incorrect. "}
                    {questions[current]?.explanation}
                  </div>
                )}
                {showFeedback && (
                  <>
                    <div className="mt-4 text-center text-base italic text-muted-foreground">
                      Fun fact: {funFacts[factIdx]}
                    </div>
                    <Button
                      onClick={handleNext}
                      className="mt-4 w-full"
                      variant="default"
                    >
                      {current + 1 === questions.length
                        ? "See Results"
                        : "Next"}
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
