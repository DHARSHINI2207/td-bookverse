import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageSquareText, Pencil } from "lucide-react";
import type { Book } from "@/types";
import { RatingStars } from "./RatingStars";

import { useAuth } from "@/context/AuthContext";
const GENRE_ACCENTS: Record<string, string> = {
  Fiction: "bg-forest",
  "Self-Help": "bg-brass",
  Dystopian: "bg-ink dark:bg-parchment",
  Fantasy: "bg-forest-light",
  "Non-Fiction": "bg-brass-dark",
  Classic: "bg-forest-dark",
  "Science Fiction": "bg-brass-light",
};

function accentFor(genre: string) {
  return GENRE_ACCENTS[genre] ?? "bg-forest";
}

export function BookCard({ book, index = 0, list = false }: { book: Book; index?: number; list?: boolean }) {
  const { isAdmin } = useAuth();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4), ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`group relative flex overflow-hidden rounded-xl2 bg-paper-surface dark:bg-charcoal-surface shadow-card hover:shadow-card-hover transition-shadow duration-300 ${list ? "w-full" : ""}`}
    >
      {/* Spine accent — a structural nod to the book itself, not decoration */}
      <span className={`w-1.5 shrink-0 ${accentFor(book.genre)}`} aria-hidden="true" />

      <div className={`flex flex-1 gap-4 p-4 ${list ? "sm:gap-6 sm:p-5" : ""}`}>
        <div className={`relative shrink-0 overflow-hidden rounded-md shadow-sm ${list ? "w-28 sm:w-36" : "w-20 sm:w-24"}`}>
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            className="h-full w-full object-cover aspect-[2/3] transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300'><rect width='100%' height='100%' fill='#ECE6D8'/><text x='50%' y='50%' font-family='Georgia' font-size='16' fill='#6B6255' text-anchor='middle'>No cover</text></svg>`
                );
            }}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold leading-tight truncate">
                {book.title}
              </h3>
              <p className="text-sm text-ink-muted dark:text-parchment/60">{book.author}</p>
            </div>
            <span className="shrink-0 rounded-full bg-forest/10 dark:bg-forest-light/20 px-2.5 py-1 text-xs font-medium text-forest-dark dark:text-forest-light">
              {book.genre}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-ink/70 dark:text-parchment/70">
            {book.description}
          </p>

          <div className="mt-auto flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <RatingStars rating={book.averageRating} size={14} />
              <span className="flex items-center gap-1 text-xs text-ink-muted dark:text-parchment/50">
                <MessageSquareText className="h-3.5 w-3.5" />
                {book.reviewCount} review{book.reviewCount === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/books/${book.id}`}
                className="rounded-full border border-ink/15 dark:border-parchment/20 px-3.5 py-1.5 text-sm font-medium hover:border-forest hover:text-forest dark:hover:border-brass-light dark:hover:text-brass-light transition-colors"
              >
                View details
              </Link>
              {list && isAdmin && (
                <Link
                  to={`/books/${book.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-parchment/20 px-3.5 py-1.5 text-sm font-medium hover:border-forest hover:text-forest dark:hover:border-brass-light dark:hover:text-brass-light transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit book
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
