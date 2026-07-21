import { questions, sources } from "../src/app/quiz/quiz-data.ts";
import { validateSources } from "../src/app/quiz/quiz-engine.ts";
const text = JSON.stringify({ questions, sources });
const banned = [/utm_/i, /doubleclick/i, /relationship/i, /private material/i, /—/];
if (!validateSources(questions, sources) || banned.some((rule) => rule.test(text))) {
  throw new Error("Quiz privacy/source audit failed");
}
console.log(`Quiz audit passed: ${questions.length} questions, ${sources.length} public sources, no tracking parameters or banned copy.`);