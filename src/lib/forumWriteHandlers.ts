import { containsBannedWords, RATE_LIMITS } from "./constants.ts";
import { createReplySchema, createTopicSchema } from "./validations.ts";

type Session = { user?: { id?: string | null } } | null;

type AnonymousWriteDependencies = {
  getSession: () => Promise<Session>;
  checkLimit: (limit: number, token: string) => Promise<{ success: boolean }>;
  requestIp: (request: Request) => string;
  anonymousWallCeiling: (perMinute: number) => Promise<boolean>;
  anonymousAuthorId: () => Promise<string>;
};

export type TopicRecord = {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorId: string;
  author: { name: string | null; username: string | null };
  _count: { replies: number };
};

type TopicWriteDependencies = AnonymousWriteDependencies & {
  createTopic: (input: {
    data: { title: string; content: string; authorId: string };
    include: {
      author: { select: { name: true; username: true } };
      _count: { select: { replies: true } };
    };
  }) => Promise<TopicRecord>;
  broadcastTopic: (topic: Omit<TopicRecord, "authorId">) => Promise<unknown>;
};

export function createTopicPostHandler(dependencies: TopicWriteDependencies) {
  return async function handleTopicPost(request: Request) {
    const session = await dependencies.getSession();
    let authorId = session?.user?.id ?? undefined;
    if (!authorId) {
      const limited = await dependencies.checkLimit(
        2,
        `anon-topic:${dependencies.requestIp(request)}`,
      );
      if (!limited.success) {
        return Response.json(
          { error: "Slow down — a couple of unsigned notes a minute." },
          { status: 429 },
        );
      }
    }

    try {
      const parseResult = createTopicSchema.safeParse(await request.json());
      if (!parseResult.success) {
        return Response.json(
          { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
          { status: 400 },
        );
      }
      const { title, content } = parseResult.data;

      if (containsBannedWords(title) || containsBannedWords(content)) {
        return Response.json(
          { error: "Your topic contains inappropriate language." },
          { status: 400 },
        );
      }

      if (!authorId) {
        if (!(await dependencies.anonymousWallCeiling(6))) {
          return Response.json(
            { error: "The square is busy — try again in a minute." },
            { status: 429 },
          );
        }
        authorId = await dependencies.anonymousAuthorId();
      }

      const topic = await dependencies.createTopic({
        data: { title, content, authorId },
        include: {
          author: { select: { name: true, username: true } },
          _count: { select: { replies: true } },
        },
      });

      await dependencies.broadcastTopic({
        id: topic.id,
        title: topic.title,
        content: topic.content,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,
        author: topic.author,
        _count: topic._count,
      });

      return Response.json({
        id: topic.id,
        title: topic.title,
        content: topic.content,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,
        authorId: topic.authorId,
      });
    } catch {
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

export type ReplyRecord = {
  id: string;
  content: string;
  topicId: string;
  authorId: string;
  [key: string]: unknown;
};

type ReplyWriteDependencies = AnonymousWriteDependencies & {
  findTopic: (topicId: string) => Promise<{ id: string } | null>;
  createReply: (input: {
    data: { content: string; topicId: string; authorId: string };
    include: {
      author: { select: { name: true; role: true; username: true } };
    };
  }) => Promise<ReplyRecord>;
  broadcastReply: (topicId: string, reply: ReplyRecord) => Promise<unknown>;
};

export function createReplyPostHandler(dependencies: ReplyWriteDependencies) {
  return async function handleReplyPost(request: Request) {
    const session = await dependencies.getSession();
    const limiterToken =
      session?.user?.id ?? `anon-reply:${dependencies.requestIp(request)}`;
    const rateLimitResult = await dependencies.checkLimit(
      RATE_LIMITS.REPLY_MAX_PER_INTERVAL,
      limiterToken,
    );
    if (!rateLimitResult.success) {
      return Response.json(
        { error: "You are replying too fast. Please wait a few seconds." },
        { status: 429 },
      );
    }

    try {
      const parseResult = createReplySchema.safeParse(await request.json());
      if (!parseResult.success) {
        return Response.json(
          { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
          { status: 400 },
        );
      }
      const { content, topicId } = parseResult.data;

      if (containsBannedWords(content)) {
        return Response.json(
          { error: "Your reply contains inappropriate language." },
          { status: 400 },
        );
      }

      const topic = await dependencies.findTopic(topicId);
      if (!topic) {
        return Response.json({ error: "Note not found" }, { status: 404 });
      }

      if (!session?.user?.id && !(await dependencies.anonymousWallCeiling(6))) {
        return Response.json(
          { error: "The square is busy — try again in a minute." },
          { status: 429 },
        );
      }
      const authorId =
        session?.user?.id ?? (await dependencies.anonymousAuthorId());

      const reply = await dependencies.createReply({
        data: { content, topicId, authorId },
        include: {
          author: { select: { name: true, role: true, username: true } },
        },
      });

      await dependencies.broadcastReply(topicId, reply);
      return Response.json(reply);
    } catch {
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
