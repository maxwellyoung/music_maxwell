"use client";

import { motion } from "framer-motion";
import { pressItems, type PressItem } from "~/data/press";

function PressCard({ item, index }: { item: PressItem; index: number }) {
  const typeColors = {
    interview: "text-blue-400",
    feature: "text-purple-400",
    review: "text-green-400",
    premiere: "text-orange-400",
  };

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group block"
    >
      <article className="relative overflow-hidden rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-6 transition-all duration-300 hover:border-foreground/10 hover:bg-foreground/[0.04]">
        {/* Type badge */}
        <span
          className={`mb-4 inline-block font-mono text-[10px] uppercase tracking-widest ${typeColors[item.type]}`}
        >
          {item.type}
        </span>

        {/* Title */}
        <h2 className="mb-2 text-lg font-medium leading-snug text-foreground/90 transition-colors group-hover:text-foreground">
          {item.title}
        </h2>

        {/* Publication & Date */}
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground/60">
            {item.publication}
          </span>
          <span className="text-foreground/20">·</span>
          <time className="text-foreground/40">
            {new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>

        {/* Excerpt */}
        {item.excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-foreground/40">
            {item.excerpt}
          </p>
        )}

        {/* Arrow indicator */}
        <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover:opacity-100">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-foreground/40"
          >
            <path
              d="M4 12L12 4M12 4H6M12 4V10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </article>
    </motion.a>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <h2 className="mb-2 text-lg font-medium text-foreground/70">
        Nothing here yet
      </h2>
      <p className="max-w-xs text-sm italic text-foreground/40">
        When journalists finally discover me, their glowing reviews will live here.
      </p>
    </motion.div>
  );
}

export default function PressPage() {
  return (
    <main className="min-h-[80vh] pb-16 pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="mb-2 text-2xl font-medium tracking-tight text-foreground/90">
            Press
          </h1>
          <p className="text-sm text-foreground/40">
            Interviews, features, and reviews
          </p>
        </motion.header>

        {/* Press Grid or Empty State */}
        {pressItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pressItems.map((item, index) => (
              <PressCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}
