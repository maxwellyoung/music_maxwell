import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createReplyPostHandler,
  createTopicPostHandler,
  type ReplyRecord,
  type TopicRecord,
} from "./forumWriteHandlers.ts";

type TopicDependencies = Parameters<typeof createTopicPostHandler>[0];
type ReplyDependencies = Parameters<typeof createReplyPostHandler>[0];

const topicEndpoint = "https://www.maxwellyoung.info/api/forum/topics";
const replyEndpoint = "https://www.maxwellyoung.info/api/forum/replies";

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7",
    },
    body: JSON.stringify(body),
  });
}

const topicRecord: TopicRecord = {
  id: "topic-1",
  title: "A title",
  content: "A note",
  createdAt: "2026-09-22T12:00:00.000Z",
  updatedAt: "2026-09-22T12:00:00.000Z",
  authorId: "anonymous-wall",
  author: { name: null, username: null },
  _count: { replies: 0 },
};

const replyRecord: ReplyRecord = {
  id: "reply-1",
  content: "An echo",
  topicId: "topic-1",
  authorId: "anonymous-wall",
  author: { name: null, role: "user", username: null },
};

function topicDependencies(
  overrides: Partial<TopicDependencies> = {},
): TopicDependencies {
  return {
    getSession: async () => null,
    checkLimit: async () => ({ success: true }),
    requestIp: () => "203.0.113.7",
    anonymousWallCeiling: async () => true,
    anonymousAuthorId: async () => "anonymous-wall",
    createTopic: async () => topicRecord,
    broadcastTopic: async () => undefined,
    ...overrides,
  };
}

function replyDependencies(
  overrides: Partial<ReplyDependencies> = {},
): ReplyDependencies {
  return {
    getSession: async () => null,
    checkLimit: async () => ({ success: true }),
    requestIp: () => "203.0.113.7",
    anonymousWallCeiling: async () => true,
    anonymousAuthorId: async () => "anonymous-wall",
    findTopic: async () => ({ id: "topic-1" }),
    createReply: async () => replyRecord,
    broadcastReply: async () => undefined,
    ...overrides,
  };
}

test("anonymous topic limiter rejects before create", async () => {
  let creates = 0;
  const handler = createTopicPostHandler(
    topicDependencies({
      checkLimit: async () => ({ success: false }),
      createTopic: async () => {
        creates += 1;
        return topicRecord;
      },
    }),
  );

  const response = await handler(
    jsonRequest(topicEndpoint, { title: "A title", content: "A note" }),
  );
  assert.equal(response.status, 429);
  assert.equal(creates, 0);
});

test("anonymous reply limiter rejects before create", async () => {
  let creates = 0;
  const handler = createReplyPostHandler(
    replyDependencies({
      checkLimit: async () => ({ success: false }),
      createReply: async () => {
        creates += 1;
        return replyRecord;
      },
    }),
  );

  const response = await handler(
    jsonRequest(replyEndpoint, { content: "An echo", topicId: "topic-1" }),
  );
  assert.equal(response.status, 429);
  assert.equal(creates, 0);
});

test("durable ceiling rejects an anonymous topic before create", async () => {
  let creates = 0;
  const handler = createTopicPostHandler(
    topicDependencies({
      anonymousWallCeiling: async () => false,
      createTopic: async () => {
        creates += 1;
        return topicRecord;
      },
    }),
  );

  const response = await handler(
    jsonRequest(topicEndpoint, { title: "A title", content: "A note" }),
  );
  assert.equal(response.status, 429);
  assert.equal(creates, 0);
});

test("durable ceiling rejects an anonymous reply before create", async () => {
  let creates = 0;
  const handler = createReplyPostHandler(
    replyDependencies({
      anonymousWallCeiling: async () => false,
      createReply: async () => {
        creates += 1;
        return replyRecord;
      },
    }),
  );

  const response = await handler(
    jsonRequest(replyEndpoint, { content: "An echo", topicId: "topic-1" }),
  );
  assert.equal(response.status, 429);
  assert.equal(creates, 0);
});

test("topic and reply handlers reject banned content", async () => {
  let creates = 0;
  const topicHandler = createTopicPostHandler(
    topicDependencies({
      createTopic: async () => {
        creates += 1;
        return topicRecord;
      },
    }),
  );
  const replyHandler = createReplyPostHandler(
    replyDependencies({
      createReply: async () => {
        creates += 1;
        return replyRecord;
      },
    }),
  );

  assert.equal(
    (
      await topicHandler(
        jsonRequest(topicEndpoint, { title: "A title", content: "shit" }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await replyHandler(
        jsonRequest(replyEndpoint, { content: "shit", topicId: "topic-1" }),
      )
    ).status,
    400,
  );
  assert.equal(creates, 0);
});

test("reply to a missing topic returns 404 before create", async () => {
  let creates = 0;
  const handler = createReplyPostHandler(
    replyDependencies({
      findTopic: async () => null,
      createReply: async () => {
        creates += 1;
        return replyRecord;
      },
    }),
  );

  const response = await handler(
    jsonRequest(replyEndpoint, { content: "An echo", topicId: "missing" }),
  );
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "Note not found" });
  assert.equal(creates, 0);
});

test("valid anonymous topic uses injected author and broadcasts after create", async () => {
  const order: string[] = [];
  let createInput: Parameters<TopicDependencies["createTopic"]>[0] | undefined;
  const handler = createTopicPostHandler(
    topicDependencies({
      anonymousAuthorId: async () => "ghost-topic",
      createTopic: async (input) => {
        createInput = input;
        order.push("create");
        return { ...topicRecord, authorId: input.data.authorId };
      },
      broadcastTopic: async () => {
        order.push("broadcast");
      },
    }),
  );

  const response = await handler(
    jsonRequest(topicEndpoint, { title: "A title", content: "A note" }),
  );
  assert.equal(response.status, 200);
  assert.equal(createInput?.data.authorId, "ghost-topic");
  assert.deepEqual(order, ["create", "broadcast"]);
  assert.equal((await response.json()).authorId, "ghost-topic");
});

test("valid anonymous reply uses injected author and broadcasts after create", async () => {
  const order: string[] = [];
  let createInput: Parameters<ReplyDependencies["createReply"]>[0] | undefined;
  const handler = createReplyPostHandler(
    replyDependencies({
      anonymousAuthorId: async () => "ghost-reply",
      createReply: async (input) => {
        createInput = input;
        order.push("create");
        return { ...replyRecord, authorId: input.data.authorId };
      },
      broadcastReply: async () => {
        order.push("broadcast");
      },
    }),
  );

  const response = await handler(
    jsonRequest(replyEndpoint, { content: "An echo", topicId: "topic-1" }),
  );
  assert.equal(response.status, 200);
  assert.equal(createInput?.data.authorId, "ghost-reply");
  assert.deepEqual(order, ["create", "broadcast"]);
  assert.equal((await response.json()).authorId, "ghost-reply");
});

test("topic broadcast failure returns current safe error", async () => {
  let creates = 0;
  const handler = createTopicPostHandler(
    topicDependencies({
      createTopic: async () => {
        creates += 1;
        return topicRecord;
      },
      broadcastTopic: async () => {
        throw new Error("private broadcast detail");
      },
    }),
  );

  const response = await handler(
    jsonRequest(topicEndpoint, { title: "A title", content: "A note" }),
  );
  assert.equal(response.status, 500);
  const body = await response.json();
  assert.deepEqual(body, { error: "Internal server error" });
  assert.equal(JSON.stringify(body).includes("private broadcast detail"), false);
  assert.equal(creates, 1);
});

test("reply broadcast failure returns current safe error", async () => {
  let creates = 0;
  const handler = createReplyPostHandler(
    replyDependencies({
      createReply: async () => {
        creates += 1;
        return replyRecord;
      },
      broadcastReply: async () => {
        throw new Error("private broadcast detail");
      },
    }),
  );

  const response = await handler(
    jsonRequest(replyEndpoint, { content: "An echo", topicId: "topic-1" }),
  );
  assert.equal(response.status, 500);
  const body = await response.json();
  assert.deepEqual(body, { error: "Internal server error" });
  assert.equal(JSON.stringify(body).includes("private broadcast detail"), false);
  assert.equal(creates, 1);
});
