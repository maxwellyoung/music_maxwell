import { ImageResponse } from "next/og";
import releases, { getReleaseBySlug } from "~/data/releases";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Maxwell Young release";

export function generateStaticParams() {
  return releases.map((release) => ({ slug: release.slug }));
}

// Pure-typographic ledger card: most covers are webp, which satori cannot
// rasterize, so the card leans on the site's real identity — the type.
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const release = getReleaseBySlug((await params).slug);
  const title = release?.title ?? "Maxwell Young";
  const meta = release
    ? `${release.releaseType ?? "release"} · ${release.releaseDate ?? ""}${
        release.duration ? ` · ${release.duration}` : ""
      }`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fafaf7",
          color: "#111111",
          padding: "72px 80px",
          fontSize: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600 }}>Maxwell Young</span>
          <span style={{ color: "rgba(17,17,17,0.4)" }}>
            maxwellyoung.info
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(17,17,17,0.15)",
              marginBottom: 48,
            }}
          />
          <span style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>
            {title}
          </span>
          <span
            style={{
              marginTop: 24,
              color: "rgba(17,17,17,0.45)",
              textTransform: "lowercase",
            }}
          >
            {meta}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
