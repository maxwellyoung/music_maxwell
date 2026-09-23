"use client";

import { useRef, useState, type FormEvent } from "react";
import { questions } from "~/lib/listenerQuestions";
import styles from "./questions.module.css";

export default function ListenerForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const submissionId = useRef<string | null>(null);
  const inFlight = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = new FormData(event.currentTarget);
    const answers = Object.fromEntries(
      questions.map((q) => [
        q.id,
        q.options ? form.getAll(q.id) : String(form.get(q.id) ?? "").trim(),
      ]),
    );
    if (!Object.values(answers).some((value) => value.length)) {
      setError("Answer at least one question before sending.");
      return;
    }
    inFlight.current = true;
    setStatus("sending");
    setError("");
    submissionId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submissionId.current, answers }),
      });
      if (!response.ok)
        throw new Error(
          response.status === 429
            ? "A few too many attempts. Please try again in a minute."
            : "Your answers couldn't be sent. They're still here — please try again.",
        );
      setStatus("sent");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Couldn't connect. Please try again.",
      );
      setStatus("idle");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <div aria-live="polite">
      {status === "sent" ? (
        <section className={styles.thanks}>
          <h2>Thank you.</h2>
          <p>I’ll read these.</p>
        </section>
      ) : (
        <form onSubmit={submit}>
          <p className={styles.note}>
            Everything is optional. Choose any that fit unless a question says
            otherwise.
          </p>
          <fieldset disabled={status === "sending"} className={styles.fields}>
            <legend className="sr-only">Your answers</legend>
            {questions.map((q, index) => (
              <fieldset key={q.id} className={styles.question}>
                <legend>
                  <span className={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {q.title}
                </legend>
                {q.hint && (
                  <p id={`${q.id}-hint`} className={styles.hint}>
                    {q.hint}
                  </p>
                )}
                {q.single && (
                  <p className={styles.hint}>Choose one, or leave blank.</p>
                )}
                {q.options ? (
                  <div className={styles.options}>
                    {q.options.map((option) => (
                      <label key={option}>
                        <input
                          type={q.single ? "radio" : "checkbox"}
                          name={q.id}
                          value={option}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    name={q.id}
                    aria-label={q.title}
                    aria-describedby={q.hint ? `${q.id}-hint` : undefined}
                    rows={3}
                    maxLength={2000}
                  />
                )}
              </fieldset>
            ))}
          </fieldset>
          <div className={styles.send}>
            <p className={styles.note}>
              Your answers go privately to Maxwell. No name or email needed.
              Please leave personal details out of your answers.
            </p>
            {error && (
              <p role="alert" className={styles.error}>
                {error}
              </p>
            )}
            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send answers ↗"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
