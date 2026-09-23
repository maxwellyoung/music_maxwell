import assert from "node:assert/strict";
import test from "node:test";
import { listenerResponseSchema } from "./listenerQuestions.ts";

const submissionId = "36c72152-a7b0-4929-9430-9d955d477a10";
const accepts = (answers: unknown) =>
  listenerResponseSchema.safeParse({ submissionId, answers }).success;
test("allows partial responses and trims text", () => {
  const result = listenerResponseSchema.parse({
    submissionId,
    answers: { song: "  A quiet song  " },
  });
  assert.equal(result.answers.song, "A quiet song");
  assert.ok(accepts({ music: ["Quiet songs", "Longer songs"] }));
});
test("rejects empty, unknown, oversized, and incorrectly shaped answers", () => {
  for (const answers of [
    {},
    { song: "  " },
    { unknown: "hello" },
    { song: "x".repeat(2001) },
    { music: "Quiet songs" },
    { song: ["hello"] },
    { music: ["invented"] },
    { music: ["Quiet songs", "Quiet songs"] },
    { frequency: ["A few times a week", "Once a week or so"] },
  ]) {
    assert.equal(accepts(answers), false);
  }
});
test("requires a valid retry identifier and rejects extra fields", () => {
  assert.equal(
    listenerResponseSchema.safeParse({
      submissionId: "bad",
      answers: { song: "Hello" },
    }).success,
    false,
  );
  assert.equal(
    listenerResponseSchema.safeParse({
      submissionId,
      answers: { song: "Hello" },
      email: "test@example.com",
    }).success,
    false,
  );
});
