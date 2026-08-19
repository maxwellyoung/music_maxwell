import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Link2,  } from "lucide-react";
import { InstagramIcon, TwitterIcon } from "~/components/icons/BrandIcons";
import { getReleaseWallWhere } from "~/lib/forum";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

type SocialLinks = {
  twitter?: string;
  instagram?: string;
  website?: string;
};

function safeLinks(value: unknown): SocialLinks {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const links = value as Record<string, unknown>;
  return Object.fromEntries(
    ["twitter", "instagram", "website"].flatMap((key) => {
      const raw = links[key];
      if (typeof raw !== "string") return [];
      try {
        const url = new URL(raw);
        return url.protocol === "https:" || url.protocol === "http:"
          ? [[key, raw]]
          : [];
      } catch {
        return [];
      }
    }),
  );
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      name: true,
      bio: true,
      socialLinks: true,
      topics: {
        where: getReleaseWallWhere(),
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          _count: { select: { replies: true } },
        },
      },
    },
  });

  if (!profile?.username) {
    return (
      <main className="notes-canvas flex min-h-[70vh] items-center px-5 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <p className="font-reenie text-5xl text-primary">no one here</p>
          <h1 className="mt-4 text-4xl">That person is not on the wall.</h1>
          <Link
            href="/forum"
            className="mt-8 inline-flex border-b-2 border-foreground pb-1 text-xs font-bold uppercase tracking-[0.18em]"
          >
            Back to Notes
          </Link>
        </div>
      </main>
    );
  }

  const links = safeLinks(profile.socialLinks);
  const displayName = profile.name || profile.username;
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <main className="notes-canvas min-h-screen">
      <section className="bg-[#11100f] px-5 pb-16 pt-8 text-white sm:px-8 sm:pb-20 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/forum"
            className="group mb-16 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            The wall
          </Link>

          <div className="grid gap-10 md:grid-cols-[0.32fr_0.68fr] md:items-end">
            <div
              className="flex aspect-square max-w-[280px] items-center justify-center rounded-full bg-[#3157ec] text-[10rem] font-bold leading-none text-white"
              aria-hidden="true"
            >
              {initial}
            </div>
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                Notes contributor
              </p>
              <h1 className="mb-3 break-words text-5xl leading-[0.9] tracking-[-0.055em] text-white sm:text-7xl lg:text-8xl">
                {displayName}
              </h1>
              <p className="font-reenie text-4xl leading-none text-white/45">
                @{profile.username}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.32fr_0.68fr] lg:gap-20">
          <aside>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground/40">
              About
            </p>
            <p className="text-foreground/72 whitespace-pre-wrap text-xl leading-relaxed">
              {profile.bio || "No bio yet. Just fragments on the wall."}
            </p>
            {Object.keys(links).length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {links.instagram && (
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 transition hover:border-accent hover:bg-accent hover:text-white"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {links.twitter && (
                  <a
                    href={links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 transition hover:border-primary hover:bg-primary hover:text-white"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </a>
                )}
                {links.website && (
                  <a
                    href={links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 transition hover:border-foreground hover:bg-foreground hover:text-background"
                    aria-label="Website"
                  >
                    <Link2 className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </aside>

          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  On the wall
                </p>
                <h2 className="mb-0 mt-2 text-4xl tracking-tight">
                  Recent fragments
                </h2>
              </div>
              <span className="font-reenie text-3xl text-foreground/40">
                {profile.topics.length} pinned
              </span>
            </div>
            <div className="border-b border-foreground/15">
              {profile.topics.length === 0 && (
                <p className="font-reenie border-t border-foreground/15 py-10 text-3xl text-foreground/45">
                  nothing pinned yet
                </p>
              )}
              {profile.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/forum/${topic.id}`}
                  className="group grid gap-4 border-t border-foreground/15 py-7 sm:grid-cols-[1fr_auto] sm:items-start"
                >
                  <div>
                    <h3 className="mb-2 text-2xl transition group-hover:text-primary">
                      {topic.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-foreground/55">
                      {topic.content}
                    </p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/35">
                      {topic.createdAt.toLocaleDateString("en-NZ", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {topic._count.replies} echoes
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
