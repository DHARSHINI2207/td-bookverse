import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, PenLine, Star, Users } from "lucide-react";
import { BookStack } from "@/components/BookStack";
import { BookCard } from "@/components/BookCard";
import { BookCardSkeleton } from "@/components/Skeletons";
import { fetchBooks } from "@/services/api";
import type { Book } from "@/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Home() {
  const [featured, setFeatured] = useState<Book[] | null>(null);

  useEffect(() => {
    fetchBooks({ sort: "rating" })
      .then((books) => setFeatured(books.slice(0, 3)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* Hero — the one deliberate animated moment on the page */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-20 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="text-sm font-medium text-brass-dark dark:text-brass-light">
            A place for readers, by readers
          </motion.p>
          <motion.h1 variants={item} className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            T&amp;D <span className="text-forest dark:text-brass-light">BookVerse</span>
          </motion.h1>
          <motion.p variants={item} className="mt-5 text-lg text-ink/70 dark:text-parchment/70 max-w-md">
            Discover stories, share your thoughts, and find your next great read — reviewed
            honestly by people who actually finished the book.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
            >
              Explore books <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 dark:border-parchment/20 px-6 py-3 text-sm font-medium hover:border-forest hover:text-forest dark:hover:border-brass-light dark:hover:text-brass-light transition-colors"
            >
              <PenLine className="h-4 w-4" /> Write a review
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex gap-8">
            <div>
              <p className="font-display text-2xl font-semibold">10+</p>
              <p className="text-sm text-ink-muted dark:text-parchment/50">Books to explore</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold">30+</p>
              <p className="text-sm text-ink-muted dark:text-parchment/50">Honest reviews</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <BookStack />
        </motion.div>
      </section>

      {/* Featured books */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Reader favorites</h2>
            <p className="text-ink-muted dark:text-parchment/60 text-sm mt-1">
              The highest-rated books on BookVerse right now.
            </p>
          </div>
          <Link
            to="/books"
            className="hidden sm:inline text-sm font-medium text-forest dark:text-brass-light hover:underline underline-offset-4"
          >
            View all books
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured === null
            ? Array.from({ length: 3 }).map((_, i) => <BookCardSkeleton key={i} />)
            : featured.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
        </div>
      </section>

      {/* Why BookVerse */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-24 grid sm:grid-cols-3 gap-6">
        {[
          { icon: Star, title: "Honest ratings", body: "Every average is calculated live from real reader reviews — nothing curated." },
          { icon: Users, title: "A real community", body: "Reviews come from readers like you, not marketing copy or press releases." },
          { icon: PenLine, title: "Your voice matters", body: "Add, edit, or remove your reviews any time — your opinion, your words." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl2 border border-ink/10 dark:border-parchment/10 p-6">
            <Icon className="h-5 w-5 text-forest dark:text-brass-light" />
            <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-ink/70 dark:text-parchment/60">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
