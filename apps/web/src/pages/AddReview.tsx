import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { StarRatingInput } from "@/components/RatingStars";
import { createReview, fetchBook, ApiRequestError } from "@/services/api";
import { useToast } from "@/hooks/useToast";
import type { ReviewFormValues } from "@/types";

const initialValues: ReviewFormValues = { reviewerName: "", title: "", rating: 0, content: "" };

function validate(values: ReviewFormValues) {
  const errors: Partial<Record<keyof ReviewFormValues, string>> = {};
  if (!values.reviewerName.trim()) errors.reviewerName = "Your name is required.";
  if (!values.title.trim()) errors.title = "Review title is required.";
  if (!values.rating) errors.rating = "Please select a rating.";
  if (!values.content.trim()) errors.content = "Review content is required.";
  return errors;
}

const inputClass =
  "w-full rounded-lg border border-ink/15 dark:border-parchment/15 bg-paper-surface dark:bg-charcoal-surface px-3.5 py-2.5 text-sm outline-none focus:border-forest dark:focus:border-brass-light transition-colors";
const labelClass = "mb-1.5 block text-sm font-medium";
const errorClass = "mt-1 text-sm text-red-600 dark:text-red-400";

export default function AddReview() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [bookTitle, setBookTitle] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [values, setValues] = useState<ReviewFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ReviewFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    fetchBook(bookId)
      .then((b) => setBookTitle(b.title))
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 404) setNotFound(true);
      });
  }, [bookId]);

  const setField = <K extends keyof ReviewFormValues>(key: K, value: ReviewFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookId) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await createReview(bookId, values);
      showToast("Review added successfully!");
      navigate(`/books/${bookId}`);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Couldn't submit your review.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Book not found</h1>
        <p className="mt-2 text-ink-muted dark:text-parchment/60">This book doesn't seem to exist anymore.</p>
        <Link to="/books" className="mt-5 inline-block text-forest dark:text-brass-light font-medium underline underline-offset-4">
          Back to books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
      {bookId && (
        <Link
          to={`/books/${bookId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-forest dark:text-parchment/60 dark:hover:text-brass-light mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to book
        </Link>
      )}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-3xl font-semibold">Write a review</h1>
        <p className="mt-1.5 text-ink-muted dark:text-parchment/60">
          {bookTitle ? (
            <>
              Sharing your thoughts on <span className="font-medium text-ink dark:text-parchment">{bookTitle}</span>
            </>
          ) : (
            "Loading book..."
          )}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label className={labelClass} htmlFor="reviewerName">Your name</label>
            <input id="reviewerName" className={inputClass} value={values.reviewerName} onChange={(e) => setField("reviewerName", e.target.value)} placeholder="e.g. Jordan Lee" />
            {errors.reviewerName && <p className={errorClass}>{errors.reviewerName}</p>}
          </div>

          <div>
            <label className={labelClass}>Rating</label>
            <StarRatingInput value={values.rating} onChange={(v) => setField("rating", v)} error={errors.rating} />
          </div>

          <div>
            <label className={labelClass} htmlFor="reviewTitle">Review title</label>
            <input id="reviewTitle" className={inputClass} value={values.title} onChange={(e) => setField("title", e.target.value)} placeholder="Sum it up in a few words" />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="content">Your review</label>
            <textarea
              id="content"
              rows={5}
              className={inputClass}
              value={values.content}
              onChange={(e) => setField("content", e.target.value)}
              placeholder="What did you think? What worked, what didn't?"
            />
            {errors.content && <p className={errorClass}>{errors.content}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit review"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-ink/15 dark:border-parchment/20 px-6 py-2.5 text-sm font-medium hover:bg-ink/5 dark:hover:bg-parchment/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
