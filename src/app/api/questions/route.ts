import { prisma } from "~/lib/prisma";
import { rateLimit } from "~/lib/rate-limit";
import { createQuestionnaireHandler } from "~/lib/questionnaireHandler";

export const runtime = "nodejs";
const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 });

// Deliberately anonymous, write-only. Responses have no public read endpoint.
export const POST = createQuestionnaireHandler({
  checkLimit: (limit, token) => limiter.check(limit, token),
  upsert: (input) => prisma.listenerResponse.upsert(input),
});
