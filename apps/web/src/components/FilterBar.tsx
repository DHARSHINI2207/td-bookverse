import type { SortOption } from "@/types";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  rating: "Highest rated",
  reviews: "Most reviewed",
  az: "A–Z",
};

export function FilterBar({
  genres,
  authors,
  genre,
  author,
  minRating,
  sort,
  onGenreChange,
  onAuthorChange,
  onMinRatingChange,
  onSortChange,
  onReset,
}: {
  genres: string[];
  authors: string[];
  genre: string;
  author: string;
  minRating: number;
  sort: SortOption;
  onGenreChange: (v: string) => void;
  onAuthorChange: (v: string) => void;
  onMinRatingChange: (v: number) => void;
  onSortChange: (v: SortOption) => void;
  onReset: () => void;
}) {
  const hasFilters = genre || author || minRating > 0;

  const selectClass =
    "rounded-full border border-ink/15 dark:border-parchment/15 bg-paper-surface dark:bg-charcoal-surface py-2 pl-3.5 pr-8 text-sm outline-none focus:border-forest dark:focus:border-brass-light transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className={selectClass} value={genre} onChange={(e) => onGenreChange(e.target.value)} aria-label="Filter by genre">
        <option value="">All genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select className={selectClass} value={author} onChange={(e) => onAuthorChange(e.target.value)} aria-label="Filter by author">
        <option value="">All authors</option>
        {authors.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={minRating}
        onChange={(e) => onMinRatingChange(Number(e.target.value))}
        aria-label="Filter by minimum rating"
      >
        <option value={0}>Any rating</option>
        <option value={4}>4+ stars</option>
        <option value={4.5}>4.5+ stars</option>
      </select>

      <select
        className={selectClass}
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        aria-label="Sort books"
      >
        {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
          <option key={key} value={key}>
            Sort: {SORT_LABELS[key]}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={onReset}
          className="text-sm font-medium text-ink-muted hover:text-forest dark:text-parchment/60 dark:hover:text-brass-light underline underline-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
