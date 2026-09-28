export function BookCardSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-xl2 bg-paper-surface dark:bg-charcoal-surface shadow-card">
      <span className="w-1.5 shrink-0 skeleton" />
      <div className="flex flex-1 gap-4 p-4">
        <div className="skeleton h-28 w-20 sm:w-24 shrink-0 rounded-md" />
        <div className="flex flex-1 flex-col gap-2 py-1">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
          <div className="skeleton h-3 w-full rounded mt-2" />
          <div className="skeleton h-3 w-5/6 rounded" />
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-7 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="rounded-xl2 border border-ink/10 dark:border-parchment/10 p-5">
      <div className="flex items-start gap-3">
        <div className="skeleton h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-32 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-4 w-1/2 rounded mt-2" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
        </div>
      </div>
    </div>
  );
}
