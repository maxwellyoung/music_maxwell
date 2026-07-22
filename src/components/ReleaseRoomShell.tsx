import type { CSSProperties, ReactNode } from "react";
import { cn } from "~/lib/utils";
import { releaseWorldFor } from "~/lib/releaseWorlds";

export default function ReleaseRoomShell({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const world = releaseWorldFor(title);

  if (!world) {
    return <main className={cn("min-h-screen", className)}>{children}</main>;
  }

  const style = {
    "--release-paper": world.material.paper,
    "--release-ink": world.material.ink,
    "--release-accent": world.material.accent,
    "--release-wash": world.material.wash,
  } as CSSProperties;

  return (
    <main
      className={cn(
        "release-room relative isolate min-h-screen overflow-hidden bg-[var(--release-paper)] text-[var(--release-ink)]",
        className,
      )}
      data-release-material={world.material.texture}
      style={style}
    >
      <div className="release-material-layer" aria-hidden="true" />
      <div className="relative z-[1]">{children}</div>
    </main>
  );
}
