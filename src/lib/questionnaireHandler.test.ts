import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createQuestionnaireHandler,
  type ListenerResponseUpsert,
} from "./questionnaireHandler.ts";

const endpoint = "https://www.maxwellyoung.info/api/questions";
const validPayload = {
  submissionId: "11111111-1111-4111-8111-111111111111",
  answers: { song: "More piano" },
};

function request(body: string, origin: string | null = new URL(endpoint).origin) {
  const headers = new Headers({ "content-type": "application/json" });
  if (origin) headers.set("origin", origin);
  return new Request(endpoint, { method: "POST", headers, body });
}

test("questionnaire rejects missing and foreign origins before storage", async () => {
  let storeCalls = 0;
  const handler = createQuestionnaireHandler({
    checkLimit: async () => ({ success: true }),
    upsert: async () => {
      storeCalls += 1;
    },
  });

  for (const origin of [null, "https://example.com"]) {
    const response = await handler(
      request(JSON.stringify(validPayload), origin),
    );
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { error: "Invalid origin" });
  }
  assert.equal(storeCalls, 0);
});

test("questionnaire rejects the sixth request in one limiter window", async () => {
  let checks = 0;
  let storeCalls = 0;
  const handler = createQuestionnaireHandler({
    checkLimit: async () => ({ success: ++checks <= 5 }),
    upsert: async () => {
      storeCalls += 1;
    },
  });

  for (let index = 0; index < 5; index += 1) {
    assert.equal(
      (await handler(request(JSON.stringify(validPayload)))).status,
      200,
    );
  }
  const limited = await handler(request(JSON.stringify(validPayload)));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "60");
  assert.equal(storeCalls, 5);
});

test("questionnaire rejects streamed bodies larger than 32KB", async () => {
  let storeCalls = 0;
  const handler = createQuestionnaireHandler({
    checkLimit: async () => ({ success: true }),
    upsert: async () => {
      storeCalls += 1;
    },
  });

  const response = await handler(request("x".repeat(32_001)));
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: "Answers are too long" });
  assert.equal(storeCalls, 0);
});

test("questionnaire rejects malformed and schema-invalid JSON", async () => {
  let storeCalls = 0;
  const handler = createQuestionnaireHandler({
    checkLimit: async () => ({ success: true }),
    upsert: async () => {
      storeCalls += 1;
    },
  });

  const malformed = await handler(request("{"));
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), { error: "Invalid answers" });

  const invalid = await handler(request(JSON.stringify({ answers: {} })));
  assert.equal(invalid.status, 400);
  assert.deepEqual(await invalid.json(), {
    error: "Please check your answers.",
  });
  assert.equal(storeCalls, 0);
});

test("questionnaire stores a valid partial response idempotently", async () => {
  const upserts: ListenerResponseUpsert[] = [];
  const handler = createQuestionnaireHandler({
    checkLimit: async () => ({ success: true }),
    upsert: async (input) => {
      upserts.push(input);
    },
  });

  const response = await handler(request(JSON.stringify(validPayload)));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.deepEqual(upserts, [
    {
      where: { submissionId: validPayload.submissionId },
      create: validPayload,
      update: {},
      select: { id: true },
    },
  ]);
});

test("questionnaire returns a safe 503 when storage fails", async () => {
  const handler = createQuestionnaireHandler({
    checkLimit: async () => ({ success: true }),
    upsert: async () => {
      throw new Error("private database detail");
    },
  });

  const response = await handler(request(JSON.stringify(validPayload)));
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.deepEqual(body, {
    error: "Couldn't save answers. Please try again.",
  });
  assert.equal(JSON.stringify(body).includes("private database detail"), false);
});
