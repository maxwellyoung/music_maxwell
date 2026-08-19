import { createPublicReleaseManifest } from "~/lib/releaseManifest";

export const dynamic = "force-static";

export function GET() {
  return Response.json(createPublicReleaseManifest(), {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
