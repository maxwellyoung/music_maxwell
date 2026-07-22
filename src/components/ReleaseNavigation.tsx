import Link from "next/link";
import { cn } from "~/lib/utils";

const releaseRooms = [
  { title: "1kiss", href: "/1kiss" },
  { title: "Sneakin Drinks Into Bars", href: "/sneakin" },
  { title: "Flying", href: "/flying" },
  { title: "Wintour", href: "/wintour" },
  { title: "Turn It Up", href: "/turn-it-up" },
];

export default function ReleaseNavigation({
  currentTitle,
  className,
}: {
  currentTitle: string;
  className?: string;
}) {
  const currentIndex = releaseRooms.findIndex(
    (release) => release.title === currentTitle,
  );
  const newer = currentIndex > 0 ? releaseRooms[currentIndex - 1] : undefined;
  const older =
    currentIndex >= 0 && currentIndex < releaseRooms.length - 1
      ? releaseRooms[currentIndex + 1]
      : undefined;

  return (
    <nav
      aria-label="Release rooms"
      className={cn(
        "border-current/20 mt-10 grid grid-cols-2 border-y sm:grid-cols-[1fr_auto_1fr]",
        className,
      )}
    >
      <div className="border-current/20 flex min-h-20 items-center border-r py-3 pr-4">
        {newer && (
          <Link
            href={newer.href}
            className="group text-sm font-bold leading-tight transition hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <span className="block text-xs font-medium opacity-45">
              ← newer
            </span>
            <span className="mt-1 block">{newer.title}</span>
          </Link>
        )}
      </div>
      <Link
        href="/#archive"
        className="border-current/20 order-3 col-span-2 flex min-h-14 items-center justify-center border-t px-5 text-xs font-bold transition hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current sm:order-none sm:col-span-1 sm:min-h-20 sm:border-t-0"
      >
        archive
      </Link>
      <div className="sm:border-current/20 flex min-h-20 items-center justify-end py-3 pl-4 text-right sm:border-l">
        {older && (
          <Link
            href={older.href}
            className="group text-sm font-bold leading-tight transition hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <span className="block text-xs font-medium opacity-45">
              older →
            </span>
            <span className="mt-1 block">{older.title}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
