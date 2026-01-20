"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { EmailCapture } from "~/components/EmailCapture";

interface Show {
  id: string;
  venue: string;
  city: string;
  date: string;
  withArtists?: string[];
  type: "headline" | "support" | "festival";
  ticketLink?: string;
}

interface ShowsClientProps {
  upcomingShows: Show[];
  pastShows: Show[];
}

function ShowCard({ show, isPast }: { show: Show; isPast: boolean }) {
  const date = new Date(show.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-6 transition-colors ${
        isPast
          ? "border-border/50 bg-muted/20 opacity-70"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
            {show.type === "support" && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                Support
              </span>
            )}
            {show.type === "festival" && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                Festival
              </span>
            )}
          </div>

          <h3 className="mb-1 text-lg font-semibold text-foreground">
            {show.venue}
          </h3>

          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{show.city}</span>
          </div>

          {show.withArtists && show.withArtists.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {show.type === "support" ? "Opening for " : "With "}
                {show.withArtists.join(", ")}
              </span>
            </div>
          )}
        </div>

        {!isPast && show.ticketLink && (
          <a
            href={show.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tickets
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function ShowsClient({ upcomingShows, pastShows }: ShowsClientProps) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold text-foreground">Shows</h1>
        <p className="text-muted-foreground">
          Live performances past and future
        </p>
      </motion.div>

      {/* Upcoming Shows */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Upcoming Shows
        </h2>

        {upcomingShows.length > 0 ? (
          <div className="space-y-4">
            {upcomingShows.map((show) => (
              <ShowCard key={show.id} show={show} isPast={false} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center"
          >
            <p className="mb-4 text-muted-foreground">
              No upcoming shows announced yet.
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Get notified when shows are announced:
            </p>
            <div className="mx-auto max-w-md">
              <EmailCapture source="shows-page" variant="minimal" />
            </div>
          </motion.div>
        )}
      </section>

      {/* Past Shows */}
      {pastShows.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-semibold text-muted-foreground">
            Past Shows
          </h2>
          <div className="space-y-4">
            {pastShows.map((show) => (
              <ShowCard key={show.id} show={show} isPast={true} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
