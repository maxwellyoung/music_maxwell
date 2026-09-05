import { prisma } from "~/lib/prisma";
import { rateLimit } from "~/lib/rate-limit";
import { listenerResponseSchema } from "~/lib/listenerQuestions";

export const runtime = "nodejs";
const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 });

// Deliberately anonymous, write-only. Responses have no public read endpoint.
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }
  const token =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous";
  if (!(await limiter.check(5, token)).success) {
    return Response.json(
      { error: "Please try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }
  // Bound streamed bodies too; Content-Length alone is not trustworthy.
  const reader = request.body?.getReader();
  if (!reader)
    return Response.json({ error: "Missing answers" }, { status: 400 });
  let body = "";
  let size = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32_000) {
        await reader.cancel();
        return Response.json(
          { error: "Answers are too long" },
          { status: 413 },
        );
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } catch {
    return Response.json({ error: "Couldn't read answers" }, { status: 400 });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json({ error: "Invalid answers" }, { status: 400 });
  }
  const parsed = listenerResponseSchema.safeParse(payload);
  if (!parsed.success)
    return Response.json(
      { error: "Please check your answers." },
      { status: 400 },
    );
  try {
    // A retry after a lost connection must not store a second response.
    await prisma.listenerResponse.upsert({
      where: { submissionId: parsed.data.submissionId },
      create: parsed.data,
      update: {},
      select: { id: true },
    });
    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Couldn't save answers. Please try again." },
      { status: 503 },
    );
  }
}
