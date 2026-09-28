import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 dark:border-parchment/10 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-forest text-white">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          <span className="font-display font-semibold">T&amp;D BookVerse</span>
        </div>
        <p className="text-sm text-ink-muted dark:text-parchment/50 text-center">
          Read. Review. Discover. &copy; {new Date().getFullYear()} T&amp;D BookVerse.
        </p>
        <nav className="flex gap-5 text-sm text-ink-muted dark:text-parchment/60">
          <Link to="/books" className="hover:text-forest dark:hover:text-brass-light">Books</Link>
          <Link to="/about" className="hover:text-forest dark:hover:text-brass-light">About</Link>
        </nav>
      </div>
    </footer>
  );
}
