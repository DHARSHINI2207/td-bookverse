import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import type { Review } from "@/types";
import { RatingStars } from "./RatingStars";
import { ReviewComments } from "./ReviewComments";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const AVATAR_PALETTE = ["bg-forest", "bg-brass", "bg-forest-light", "bg-brass-dark"];
function avatarColor(name: string) {
  const sum = [...name].reduce((s, c) => s + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
}

export function ReviewCard({
  review,
  onEdit,
  onDelete,
  highlight = false,
}: {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
  highlight?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundColor: highlight
          ? ["rgba(184,134,59,0.22)", "rgba(184,134,59,0)"]
          : "rgba(184,134,59,0)",
      }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: highlight ? 1.6 : 0.3, ease: "easeOut" }}
      className="rounded-xl2 border border-ink/10 dark:border-parchment/10 bg-paper-surface dark:bg-charcoal-surface p-5"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColor(
            review.reviewerName
          )}`}
          aria-hidden="true"
        >
          {initials(review.reviewerName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <div>
              <p className="font-medium">{review.reviewerName}</p>
              <p className="text-xs text-ink-muted dark:text-parchment/50">
                {formatDate(review.createdAt)}
                {review.updatedAt !== review.createdAt ? " · edited" : ""}
              </p>
            </div>
            <RatingStars rating={review.rating} size={14} showValue={false} />
          </div>

          <h4 className="mt-2 font-display text-base font-semibold">{review.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-ink/80 dark:text-parchment/80">
            {review.content}
          </p>

          <div className="mt-3 flex gap-4">
            <button
              onClick={() => onEdit(review)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-forest dark:text-parchment/60 dark:hover:text-brass-light transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              onClick={() => onDelete(review)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-red-600 dark:text-parchment/60 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>

          <ReviewComments reviewId={review.id} />
        </div>
      </div>
    </motion.div>
  );
}
