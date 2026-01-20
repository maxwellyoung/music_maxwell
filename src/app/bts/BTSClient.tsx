"use client";

import { motion } from "framer-motion";
import { Mic, Music, FileText, Play, Lock } from "lucide-react";
import { EmailCapture } from "~/components/EmailCapture";

interface BTSContent {
  id: string;
  title: string;
  type: "demo" | "breakdown" | "notes" | "video";
  description: string;
  date: string;
  mediaUrl: string | null;
  relatedSong?: string;
}

interface BTSClientProps {
  content: BTSContent[];
}

const typeIcons = {
  demo: Mic,
  breakdown: Music,
  notes: FileText,
  video: Play,
};

const typeLabels = {
  demo: "Demo",
  breakdown: "Production",
  notes: "Writing",
  video: "Video",
};

const typeColors = {
  demo: "bg-purple-500/10 text-purple-500",
  breakdown: "bg-blue-500/10 text-blue-500",
  notes: "bg-amber-500/10 text-amber-500",
  video: "bg-red-500/10 text-red-500",
};

export function BTSClient({ content }: BTSClientProps) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          Behind the Scenes
        </h1>
        <p className="mx-auto max-w-lg text-muted-foreground">
          A peek into the creative process - demos, voice memos, production
          breakdowns, and the stories behind the songs.
        </p>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center"
      >
        <Lock className="mx-auto mb-4 h-8 w-8 text-primary" />
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Exclusive Content Coming Soon
        </h2>
        <p className="mb-6 text-muted-foreground">
          Be the first to access demos, production breakdowns, and behind the
          scenes content.
        </p>
        <div className="mx-auto max-w-md">
          <EmailCapture source="bts-page" variant="hero" />
        </div>
      </motion.div>

      {/* Preview Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {content.map((item, index) => {
          const Icon = typeIcons[item.type];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              {/* Locked overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <div className="text-center">
                  <Lock className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Type badge */}
              <div
                className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${typeColors[item.type]}`}
              >
                <Icon className="h-3 w-3" />
                {typeLabels[item.type]}
              </div>

              <h3 className="mb-2 font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>

              {item.relatedSong && (
                <p className="text-xs text-muted-foreground">
                  Related: <span className="text-primary">{item.relatedSong}</span>
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
