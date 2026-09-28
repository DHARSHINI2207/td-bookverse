import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3 rounded-xl2 border border-dashed border-ink/15 dark:border-parchment/15 px-6 py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 dark:bg-brass-light/10">
        <Icon className="h-6 w-6 text-forest dark:text-brass-light" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-ink-muted dark:text-parchment/60">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-2 rounded-full bg-forest px-5 py-2 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
