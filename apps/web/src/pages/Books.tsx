import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BookX } from "lucide-react";
import { BookCard } from "@/components/BookCard";
import { BookCardSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import { fetchBooks, ApiRequestError } from "@/services/api";
import type { Book, SortOption } from "@/types";

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOption>("newest");

  const [allBooks, setAllBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setSearchParams(debouncedSearch ? { search: debouncedSearch } : {}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetchBooks({ search: debouncedSearch, genre, author, minRating: minRating || undefined, sort })
      .then((books) => !cancelled && setAllBooks(books))
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof ApiRequestError ? err.message : "Couldn't load books.";
        setError(message);
        showToast(message, "error");
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, genre, author, minRating, sort, showToast]);

  const { genres, authors } = useMemo(() => {
    const source = allBooks ?? [];
    return {
      genres: Array.from(new Set(source.map((b) => b.genre))).sort(),
      authors: Array.from(new Set(source.map((b) => b.author))).sort(),
    };
  }, [allBooks]);

  const resetFilters = () => {
    setGenre("");
    setAuthor("");
    setMinRating(0);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Browse books</h1>
        <p className="mt-1.5 text-ink-muted dark:text-parchment/60">
          {allBooks ? `${allBooks.length} book${allBooks.length === 1 ? "" : "s"} on the shelf` : "Loading the shelf..."}
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <SearchBar value={search} onChange={setSearch} className="max-w-md" />
        <FilterBar
          genres={genres}
          authors={authors}
          genre={genre}
          author={author}
          minRating={minRating}
          sort={sort}
          onGenreChange={setGenre}
          onAuthorChange={setAuthor}
          onMinRatingChange={setMinRating}
          onSortChange={setSort}
          onReset={resetFilters}
        />
      </div>

      {error && allBooks === null ? (
        <EmptyState
          icon={BookX}
          title="Couldn't load books"
          description={error}
        />
      ) : allBooks === null ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : allBooks.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="No books found"
          description="Try a different search term, or clear your filters to see the whole shelf."
        />
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {allBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
