import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search books or authors...",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted dark:text-parchment/50" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search books"
        className="w-full rounded-full border border-ink/15 dark:border-parchment/15 bg-paper-surface dark:bg-charcoal-surface py-2.5 pl-10 pr-9 text-sm outline-none placeholder:text-ink-muted/70 dark:placeholder:text-parchment/40 focus:border-forest dark:focus:border-brass-light transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:text-parchment/50 dark:hover:text-parchment"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
