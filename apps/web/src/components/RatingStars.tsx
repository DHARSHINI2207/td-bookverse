import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

/** Read-only star display, e.g. ★★★★★ 4.8/5 */
export function RatingStars({
  rating,
  size = 16,
  showValue = true,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
}) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i && rating < i + 1;
          return (
            <span key={i} className="relative">
              <Star
                width={size}
                height={size}
                className="text-brass-dark/30 dark:text-brass-light/20"
                strokeWidth={1.5}
              />
              {(filled || half) && (
                <Star
                  width={size}
                  height={size}
                  className="absolute inset-0 text-brass dark:text-brass-light"
                  fill="currentColor"
                  strokeWidth={1.5}
                  style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
                />
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium tabular-nums text-ink/70 dark:text-parchment/70">
          {rating > 0 ? rating.toFixed(1) : "—"}
        </span>
      )}
    </div>
  );
}

/** Interactive 1-5 star picker used in review forms. */
export function StarRatingInput({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div>
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Rating, 1 to 5 stars"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const filled = display >= starValue;
          return (
            <motion.button
              key={i}
              type="button"
              role="radio"
              aria-checked={value === starValue}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.15 }}
              onMouseEnter={() => setHovered(starValue)}
              onFocus={() => setHovered(starValue)}
              onBlur={() => setHovered(null)}
              onClick={() => onChange(starValue)}
              className="p-0.5"
            >
              <Star
                width={30}
                height={30}
                className={filled ? "text-brass dark:text-brass-light" : "text-ink/20 dark:text-parchment/20"}
                fill={filled ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            </motion.button>
          );
        })}
        {value > 0 && (
          <span className="ml-2 text-sm text-ink/60 dark:text-parchment/60">{value}/5</span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
