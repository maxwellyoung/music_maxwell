"use client";

// Throwaway homepage directions: ?variant=A|B|C. Awaiting Maxwell's selection.
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import MinimalExcerpt from "./MinimalExcerpt";
import type { ReleaseSummary } from "~/lib/releaseSummary";
import styles from "./DesignPrototype.module.css";

const names = ["Sleeve notes", "After hours", "Record box"];
const keys = ["A", "B", "C"];
const year = (r: ReleaseSummary) => r.releaseDate?.match(/\d{4}$/)?.[0];
function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/">Maxwell Young</Link>
      <span>
        <a href="#records">Records</a>
        <Link href="/questions">A few questions</Link>
        <Link href="/forum">Town square ↗</Link>
      </span>
    </nav>
  );
}
function Player({ release }: { release: ReleaseSummary }) {
  return release.previewUrl ? (
    <MinimalExcerpt
      key={release.slug}
      src={release.previewUrl}
      title={release.title}
    />
  ) : (
    <Link href={`/r/${release.slug}`}>Listen & liner notes ↗</Link>
  );
}
function Archive({ releases }: { releases: ReleaseSummary[] }) {
  return (
    <section id="records" className={styles.archive}>
      <div className={styles.sectionTitle}>
        <h2>The recordings</h2>
        <span>2018 — 2026</span>
      </div>
      {releases.map((r, i) => (
        <Link key={r.slug} href={`/r/${r.slug}`}>
          <span className={styles.number}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{r.title}</span>
          <small>{year(r)} ↗</small>
        </Link>
      ))}
    </section>
  );
}
export function SleeveNotes({ releases }: { releases: ReleaseSummary[] }) {
  const r = releases[0]!;
  return (
    <div className={`${styles.design} ${styles.sleeve}`}>
      <Nav />
      <h1 className={styles.masthead}>
        Maxwell
        <br />
        <em>Young</em>
        <span>
          songs, in
          <br />
          good company.
        </span>
      </h1>
      <section className={styles.sleeveFeature}>
        <div className={styles.sleeveCopy}>
          <span className={styles.eyebrow}>The latest single / 2026</span>
          <h2>
            {r.title}
            <sup>♡</sup>
          </h2>
          <p>
            your hips
            <br />
            our lips
            <br />
            <em>one kiss</em>
          </p>
          <Player release={r} />
          <Link className={styles.notesLink} href={`/r/${r.slug}`}>
            Open the sleeve ↗
          </Link>
        </div>
        <Link href={`/r/${r.slug}`} className={styles.cover}>
          <Image
            src={r.artwork}
            alt="1kiss artwork"
            fill
            priority
            sizes="(max-width: 700px) 90vw, 52vw"
          />
          <span>MY — 017 / 1kiss</span>
        </Link>
      </section>
      <Archive releases={releases} />
      <footer>
        Made to be listened to.<span>Maxwell Young © 2026</span>
      </footer>
    </div>
  );
}
export function AfterHours({ releases }: { releases: ReleaseSummary[] }) {
  const r = releases[0]!;
  return (
    <div className={`${styles.design} ${styles.night}`}>
      <Nav />
      <section className={styles.cinema}>
        <Image
          src="/1kiss/still-film-editorial.jpg"
          alt="Maxwell Young in the 1kiss film"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.cinemaShade} />
        <span className={styles.filmLabel}>MAXWELL YOUNG / 1KISS / 2026</span>
        <div className={styles.cinemaTitle}>
          <p>A little closer.</p>
          <h1>1kiss</h1>
        </div>
        <div className={styles.cinemaPlayer}>
          <span className={styles.eyebrow}>The new single · out now</span>
          <Player release={r} />
          <Link href="/r/1kiss">Listen everywhere ↗</Link>
        </div>
        <span className={styles.frame}>01 / 17</span>
      </section>
      <section id="records" className={styles.nightRecords}>
        <div className={styles.sectionTitle}>
          <h2>Stay a while.</h2>
          <span>The recordings ↓</span>
        </div>
        <div className={styles.filmStrip}>
          {releases.map((r) => (
            <Link key={r.slug} href={`/r/${r.slug}`}>
              <div>
                <Image
                  src={r.artwork}
                  alt={`${r.title} artwork`}
                  fill
                  sizes="(max-width: 700px) 70vw, 25vw"
                />
              </div>
              <p>
                {r.title}
                <small>{year(r)}</small>
              </p>
            </Link>
          ))}
        </div>
      </section>
      <footer>
        Music for the space between things.<span>Maxwell Young © 2026</span>
      </footer>
    </div>
  );
}
export function RecordBox({ releases }: { releases: ReleaseSummary[] }) {
  const [selected, setSelected] = useState(releases[0]!);
  return (
    <div className={`${styles.design} ${styles.box}`}>
      <Nav />
      <header className={styles.boxHeader}>
        <h1>
          Good
          <br />
          <em>company.</em>
        </h1>
        <p>
          A collection of recordings
          <br />
          by Maxwell Young.
          <br />
          <span>Pick something to put on.</span>
        </p>
        <span className={styles.stamp}>
          MY
          <br />
          33⅓
        </span>
      </header>
      <section id="records" className={styles.recordDesk}>
        <div className={styles.shelves}>
          {releases.map((r, i) => (
            <button
              key={r.slug}
              onClick={() => setSelected(r)}
              aria-pressed={selected.slug === r.slug}
              aria-label={`Select ${r.title}`}
            >
              <div style={{ transform: `rotate(${((i % 3) - 1) * 3}deg)` }}>
                <Image
                  src={r.artwork}
                  alt={`${r.title} artwork`}
                  fill
                  sizes="(max-width: 700px) 40vw, 20vw"
                  priority={i < 3}
                />
              </div>
              <span>
                {String(i + 1).padStart(2, "0")} / {r.title}
              </span>
            </button>
          ))}
        </div>
        <aside className={styles.recordInfo}>
          <span className={styles.eyebrow}>On the turntable</span>
          <div className={styles.selectedCover}>
            <Image
              src={selected.artwork}
              alt={`${selected.title} selected artwork`}
              fill
              sizes="(max-width: 700px) 100px, 25vw"
            />
          </div>
          <h2>{selected.title}</h2>
          <p>
            {selected.releaseType} · {year(selected)}
          </p>
          <Player release={selected} />
          <Link className={styles.notesLink} href={`/r/${selected.slug}`}>
            Lyrics, credits & listening links ↗
          </Link>
        </aside>
      </section>
      <footer>
        There’s always room for one more record.
        <span>Maxwell Young © 2026</span>
      </footer>
    </div>
  );
}
export default function DesignPrototype({
  releases,
}: {
  releases: ReleaseSummary[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const index = Math.max(0, keys.indexOf(params.get("variant") ?? "A"));
  const cycle = useCallback(
    (step: number) =>
      router.replace(`/?variant=${keys[(index + step + 3) % 3]}`, {
        scroll: true,
      }),
    [index, router],
  );
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        (event.target as HTMLElement)?.closest(
          "input,textarea,select,[contenteditable=true],button,a",
        )
      )
        return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        cycle(event.key === "ArrowRight" ? 1 : -1);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [cycle]);
  const Variant = [SleeveNotes, AfterHours, RecordBox][index]!;
  return (
    <>
      <Variant key={index} releases={releases} />
      {process.env.NODE_ENV !== "production" && (
        <div className={styles.switcher} aria-label="Design prototype controls">
          <button onClick={() => cycle(-1)} aria-label="Previous design">
            ←
          </button>
          <span>
            <small>DESIGN PREVIEW {index + 1}/3</small>
            {keys[index]} — {names[index]}
          </span>
          <button onClick={() => cycle(1)} aria-label="Next design">
            →
          </button>
          <Link href="/?variant=original">Original</Link>
        </div>
      )}
    </>
  );
}
