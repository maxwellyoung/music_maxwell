import type { Metadata } from "next";
import Link from "next/link";
import ListenerForm from "./ListenerForm";
import styles from "./questions.module.css";

export const metadata: Metadata = {
  title: "A few questions — Maxwell Young",
  description:
    "About the music, and the things around it. A listener questionnaire.",
  alternates: { canonical: "/questions" },
};

export default function QuestionsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/">Maxwell Young</Link>
        <span>Listener questionnaire</span>
      </header>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Music & everything around it</p>
        <h1>A few questions</h1>
        <p>
          I’m making music and figuring out what to share along the way. I’d
          like to know what you enjoy.
        </p>
        <p>
          Answer as much or as little as you like. About five minutes,
          depending.
        </p>
      </div>
      <ListenerForm />
      <footer className={styles.footer}>
        <Link href="/">Back to the music ↗</Link>
      </footer>
    </main>
  );
}
