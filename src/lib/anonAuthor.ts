import { prisma } from "~/lib/prisma";

// The wall accepts unsigned notes for now. They attribute to one
// well-known ghost account (the UI already renders null usernames as
// "anonymous"), so no schema change is needed and sign-in can be
// re-required by deleting the two callers of this helper.
const ANON_ID = "anonymous-wall";

export async function anonymousAuthorId(): Promise<string> {
  const anon = await prisma.user.upsert({
    where: { id: ANON_ID },
    update: {},
    create: {
      id: ANON_ID,
      email: "anonymous@maxwellyoung.info",
      name: null,
      username: null,
    },
  });
  return anon.id;
}

export function requestIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
