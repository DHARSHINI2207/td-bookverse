import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarDays, MessageSquareText, PenLine } from "lucide-react";
import { RatingStars } from "@/components/RatingStars";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewCardSkeleton } from "@/components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/Modal";
import { useToast } from "@/hooks/useToast";
import { deleteReview, fetchBook, ApiRequestError } from "@/services/api";
import type { BookWithReviews, Review } from "@/types";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const highlightId = (location.state as { highlightReviewId?: string } | null)?.highlightReviewId;

  const [book, setBook] = useState<BookWithReviews | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    if (!id) return;
    fetchBook(id)
      .then(setBook)
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 404) {
          setNotFound(true);
        } else {
          showToast("Couldn't load this book. Please try again.", "error");
        }
      });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEdit = (review: Review) => {
    navigate(`/reviews/${review.id}/edit`, { state: { review } });
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    setDeleting(true);
    try {
      await deleteReview(reviewToDelete.id);
      setBook((prev) =>
        prev
          ? {
              ...prev,
              reviews: prev.reviews.filter((r) => r.id !== reviewToDelete.id),
            }
          : prev
      );
      showToast("Review deleted successfully!");
      setReviewToDelete(null);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Couldn't delete review.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EmptyState
          icon={MessageSquareText}
          title="Book not found"
          description="This book may have been removed. Head back to the shelf to keep browsing."
          actionLabel="Back to books"
          actionTo="/books"
        />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-6">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="flex gap-6">
          <div className="skeleton h-56 w-40 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-4 w-1/4 rounded" />
          </div>
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <ReviewCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
      <Link
        to="/books"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-forest dark:text-parchment/60 dark:hover:text-brass-light mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to books
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-6"
      >
        <img
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="w-40 sm:w-48 shrink-0 rounded-lg shadow-card object-cover aspect-[2/3] mx-auto sm:mx-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><rect width='100%' height='100%' fill='#ECE6D8'/><text x='50%' y='50%' font-family='Georgia' font-size='20' fill='#6B6255' text-anchor='middle'>No cover</text></svg>`
              );
          }}
        />

        <div className="flex-1 text-center sm:text-left">
          <span className="inline-block rounded-full bg-forest/10 dark:bg-brass-light/10 px-3 py-1 text-xs font-medium text-forest-dark dark:text-brass-light">
            {book.genre}
          </span>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold">{book.title}</h1>
          <p className="mt-1 text-lg text-ink/70 dark:text-parchment/70">by {book.author}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-ink-muted dark:text-parchment/60">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {book.publicationYear}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageSquareText className="h-4 w-4" /> {book.reviewCount} review
              {book.reviewCount === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-3 flex justify-center sm:justify-start">
            <RatingStars rating={book.averageRating} size={20} />
          </div>

          <p className="mt-5 text-ink/80 dark:text-parchment/80 leading-relaxed max-w-prose">
            {book.description}
          </p>

          <Link
            to={`/books/${book.id}/reviews/new`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
          >
            <PenLine className="h-4 w-4" /> Write a review
          </Link>
        </div>
      </motion.div>

      <hr className="my-10 border-ink/10 dark:border-parchment/10" />

      <h2 className="font-display text-2xl font-semibold mb-5">
        Reviews {book.reviewCount > 0 && <span className="text-ink-muted dark:text-parchment/50 font-sans text-base font-normal">({book.reviewCount})</span>}
      </h2>

      {book.reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No reviews yet"
          description="Be the first to share what you thought of this book."
          actionLabel="Write a review"
          actionTo={`/books/${book.id}/reviews/new`}
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {book.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={handleEdit}
                onDelete={setReviewToDelete}
                highlight={review.id === highlightId}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={!!reviewToDelete} onClose={() => setReviewToDelete(null)} title="Delete this review?">
        <p className="text-sm text-ink/70 dark:text-parchment/70">
          This will permanently remove {reviewToDelete?.reviewerName}'s review. This can't be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={() => setReviewToDelete(null)}
            disabled={deleting}
            className="rounded-full border border-ink/15 dark:border-parchment/20 px-4 py-2 text-sm font-medium hover:bg-ink/5 dark:hover:bg-parchment/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleting}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete review"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
