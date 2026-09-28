import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookMarked, MessageCircleHeart, Sparkles } from "lucide-react";

const features = [
  { icon: BookMarked, title: "A growing shelf", body: "Browse a curated shelf of fiction, non-fiction, fantasy, and classics — with more added by the community all the time." },
  { icon: MessageCircleHeart, title: "Reviews you can trust", body: "Ratings are calculated live from real reviews. No sponsored placements, no inflated scores." },
  { icon: Sparkles, title: "Built for readers", body: "Add, edit, or delete your reviews whenever you like. BookVerse is shaped by the people using it." },
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-sm font-medium text-brass-dark dark:text-brass-light">Our story</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">About T&amp;D BookVerse</h1>
        <p className="mt-5 text-lg text-ink/75 dark:text-parchment/75 leading-relaxed">
          T&amp;D BookVerse is a place for readers to discover books, share honest opinions, and
          find stories worth reading.
        </p>

        <div className="mt-10 rounded-xl2 border border-ink/10 dark:border-parchment/10 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Our mission</h2>
          <p className="mt-2 text-ink/75 dark:text-parchment/75 leading-relaxed">
            Most review sites reward volume over honesty. We built BookVerse around a simpler
            idea: a small, well-kept shelf where every rating comes from someone who actually
            read the book, and every review is easy to add, correct, or take back.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl2 border border-ink/10 dark:border-parchment/10 p-5">
              <Icon className="h-5 w-5 text-forest dark:text-brass-light" />
              <h3 className="mt-3 font-display text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-ink/70 dark:text-parchment/60">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl2 bg-forest/5 dark:bg-brass-light/5 p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl font-semibold">Join the community</h2>
          <p className="mt-2 text-ink/70 dark:text-parchment/70 max-w-md mx-auto">
            Every review adds to a shelf shaped entirely by readers like you. Start with a book you
            already love.
          </p>
          <Link
            to="/books"
            className="mt-5 inline-block rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
          >
            Explore the shelf
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
