import { listenerResponseSchema } from "./listenerQuestions.ts";

type ListenerResponse = {
  submissionId: string;
  answers: Record<string, string | string[]>;
};

export type ListenerResponseUpsert = {
  where: { submissionId: string };
  create: ListenerResponse;
  update: Record<string, never>;
  select: { id: true };
};

type QuestionnaireDependencies = {
  checkLimit: (limit: number, token: string) => Promise<{ success: boolean }>;
  upsert: (input: ListenerResponseUpsert) => Promise<unknown>;
};

export function createQuestionnaireHandler({
  checkLimit,
  upsert,
}: QuestionnaireDependencies) {
  return async function handleQuestionnaire(request: Request) {
    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return Response.json({ error: "Invalid origin" }, { status: 403 });
    }
    const token =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "anonymous";
    if (!(await checkLimit(5, token)).success) {
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
      await upsert({
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
  };
}
