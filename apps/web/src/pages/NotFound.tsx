import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <BookX className="h-16 w-16 text-forest dark:text-brass-light" />
      </motion.div>
      <h1 className="mt-6 font-display text-5xl font-semibold">404</h1>
      <p className="mt-3 text-lg font-medium">This page fell off the shelf.</p>
      <p className="mt-2 text-ink-muted dark:text-parchment/60">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
